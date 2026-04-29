'use server';

import { writeFile, mkdir, rm } from 'fs/promises';
import { join, extname } from 'path';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { auth } from '@/auth';

export async function checkIsAdmin() {
  const session = await auth();
  const role = ((session?.user as any)?.role || 'guest').toLowerCase();
  return role === 'admin';
}

export async function uploadBeerjuvenation(formData: FormData) {
  try {
    const year = formData.get('year') as string;
    const yearName = formData.get('year_name') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('main_image') as File | null;
    const secondaryImages = formData.getAll('secondary_images') as File[];

    // Ensure only admins can upload/edit
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) throw new Error("Unauthorized: Admins only");

    if (!year) throw new Error("Year is required");

    // Define where to save the files on the QNAP (without a year subfolder)
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'beerjuvenation');
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    let mainImageUrl = null;
    if (mainImage && mainImage.size > 0) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const ext = extname(mainImage.name); // grabs e.g. ".jpg"
      const filename = `${year}_Beerjuvenation${ext}`;
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      mainImageUrl = `/uploads/beerjuvenation/${filename}`;
    }

    const secondaryImageUrls: string[] = [];
    for (let i = 0; i < secondaryImages.length; i++) {
      const img = secondaryImages[i];
      if (img && img.size > 0) {
        const buffer = Buffer.from(await img.arrayBuffer());
        const ext = extname(img.name);
        // Append an index so secondary images don't overwrite each other or the main image
        const filename = `${year}_Beerjuvenation_${i + 1}${ext}`;
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);
        secondaryImageUrls.push(`/uploads/beerjuvenation/${filename}`);
      }
    }

    const secondaryImagesJson = JSON.stringify(secondaryImageUrls);

    // --- DATABASE INSERT USING DRIZZLE ---
    await db.execute(sql`
      INSERT INTO beerjuvenation (year, description, main_image_url, secondary_image_urls, year_name) 
      VALUES (${parseInt(year, 10)}, ${description}, ${mainImageUrl}, ${secondaryImagesJson}, ${yearName})
      ON DUPLICATE KEY UPDATE 
      description=VALUES(description), 
      main_image_url=COALESCE(VALUES(main_image_url), main_image_url), 
      secondary_image_urls=IF(VALUES(secondary_image_urls) = '[]', secondary_image_urls, VALUES(secondary_image_urls)), 
      year_name=VALUES(year_name)
    `);

    console.log("POC Successfully processed:", { year, yearName, description, mainImageUrl, secondaryImageUrls });

    return { success: true };
  } catch (error) {
    console.error('Error uploading beerjuvenation:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteBeerjuvenation(year: number) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) throw new Error("Unauthorized: Admins only");

    // 1. Find the specific files in the database to delete
    const result = await db.execute(sql`SELECT main_image_url, secondary_image_urls FROM beerjuvenation WHERE year = ${year}`) as any;
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    const record = Array.isArray(rows) ? rows[0] : null;

    if (record) {
      const filesToDelete: string[] = [];
      if (record.main_image_url) filesToDelete.push(record.main_image_url);
      if (record.secondary_image_urls) {
        try { filesToDelete.push(...JSON.parse(record.secondary_image_urls)); } catch (e) {}
      }

      for (const fileUrl of filesToDelete) {
        const filename = fileUrl.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'beerjuvenation', filename);
          await rm(filePath, { force: true }).catch(() => {}); // catch ignores errors if the file is already gone
        }
      }
    }

    // 2. Delete the record from the MariaDB database
    await db.execute(sql`DELETE FROM beerjuvenation WHERE year = ${year}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting beerjuvenation entry:', error);
    return { success: false, error: String(error) };
  }
}

export async function getBeerjuvenationEntries() {
  try {
    const result = await db.execute(sql`SELECT * FROM beerjuvenation ORDER BY year DESC`) as any;
    // The mysql2 driver returns [rows, fields], so we extract just the rows here
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching beerjuvenation entries:', error);
    return { success: false, error: String(error) };
  }
}