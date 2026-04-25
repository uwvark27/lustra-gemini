const familyData: Record<string, { fullName: string; bio: string; role: string; hobbies: string[] }> = {
  marc: {
    fullName: 'Marc Cartwright',
    role: 'Dad',
    bio: 'Software engineer and master of the QNAP server. Always building cool new web apps.',
    hobbies: ['Coding', 'Tech', 'DIY Projects'],
  },
  alejandra: {
    fullName: 'Alejandra Cartwright',
    role: 'Mom',
    bio: 'The glue that holds the family together. Amazing chef and event planner.',
    hobbies: ['Reading', 'Cooking', 'Travel'],
  },
  isaac: {
    fullName: 'Isaac Cartwright',
    role: 'Son',
    bio: 'Loves playing video games, exploring the outdoors, and learning new things.',
    hobbies: ['Gaming', 'Biking', 'Science'],
  },
  pax: {
    fullName: 'Pax Cartwright',
    role: 'Son',
    bio: 'Always full of energy and ready for the next big adventure.',
    hobbies: ['Sports', 'Building Forts', 'Drawing'],
  },
  lyra: {
    fullName: 'Lyra Cartwright',
    role: 'Daughter',
    bio: 'The youngest of the bunch, bringing smiles and laughter to everyone.',
    hobbies: ['Dancing', 'Singing', 'Playing with toys'],
  }
};

export default async function FamilyMemberPage({
  params,
}: {
  params: Promise<{ member: string }>;
}) {
  const resolvedParams = await params;
  const memberKey = resolvedParams.member.toLowerCase();
  const data = familyData[memberKey];

  if (!data) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Member Not Found</h2>
        <p className="text-slate-500 italic">We couldn't find a profile for this family member.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2">{data.fullName}</h2>
      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-6">{data.role}</span>
      
      <p className="text-slate-700 text-lg mb-6">{data.bio}</p>
      
      <h3 className="font-semibold text-slate-900 mb-2">Hobbies & Interests</h3>
      <ul className="list-disc list-inside text-slate-600 ml-4">
        {data.hobbies.map((hobby) => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}
