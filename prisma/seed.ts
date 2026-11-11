import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Silent Key Archive...')

  // Demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@silentkey.net.au' },
    update: {},
    create: {
      name: 'Archive Admin',
      email: 'demo@silentkey.net.au',
      passwordHash: await bcrypt.hash('silentkey2024', 10),
    },
  })

  // VK3TOM — Thomas "Tom" Mitchell
  const vk3tom = await prisma.operatorProfile.upsert({
    where: { callsign: 'VK3TOM' },
    update: {},
    create: {
      callsign: 'VK3TOM',
      name: 'Thomas "Tom" Mitchell',
      born: 1935,
      died: 2019,
      locationQth: 'Shepparton, Victoria',
      licenceClass: 'Amateur (Full)',
      firstLicenced: 1958,
      isDraft: false,
      isUnclaimed: false,
      createdById: demoUser.id,
      biography: `Thomas "Tom" Mitchell, VK3TOM, was one of the most respected amateur radio operators in the Goulburn Valley region for over six decades. Born in Shepparton in 1935, Tom developed his fascination with electronics as a boy, building crystal radio sets from salvaged parts before he could afford a proper receiver.

Tom was first licenced in 1958 after completing his Morse code proficiency test at the Shepparton Post Office — a process he described as "the most nervous twenty minutes of my life." He operated under the call VK3TOM from that day until his death in January 2019, a continuity of service spanning sixty-one years.

His most celebrated moment came during the Ash Wednesday bushfires of February 1983, when Tom operated his station for thirty-six hours without rest, relaying welfare messages between affected communities and emergency services after telephone lines failed across the region. His log from those days — still preserved in the SADARC archives — records over 400 individual contacts. He was awarded a Certificate of Appreciation by the State Emergency Service, one of only three amateur radio operators so honoured that year.

In later years Tom became known as a patient and generous Elmer to dozens of new licensees across north-central Victoria. He had a gift for explaining complex antenna theory in plain language and kept his workshop open every Saturday morning for anyone who wanted to learn. He is survived by his wife Jean, two daughters, and four grandchildren, all of whom he taught to send Morse code.`,
    },
  })

  // Timeline events for VK3TOM
  await prisma.timelineEvent.createMany({
    data: [
      { profileId: vk3tom.id, year: 1935, title: 'Born in Shepparton, Victoria', isHighlight: false },
      { profileId: vk3tom.id, year: 1950, title: 'Builds first crystal radio set', description: 'Constructed from salvaged parts at age 15; first heard a broadcast from Melbourne.', isHighlight: false },
      { profileId: vk3tom.id, year: 1958, title: 'First licensed as VK3TOM', description: 'Passed Morse code test at Shepparton Post Office. His first QSO was with VK2AX in Sydney.', isHighlight: true },
      { profileId: vk3tom.id, year: 1961, title: 'Joined SADARC', description: 'Became a founding member of the Shepparton and District Amateur Radio Club.', isHighlight: false },
      { profileId: vk3tom.id, year: 1965, title: 'Upgraded station to Collins S-Line', description: 'Acquired the Collins 75S-3B receiver and 32S-3 transmitter that would define his operating style for the next two decades.', isHighlight: false },
      { profileId: vk3tom.id, year: 1972, title: 'SADARC Club President (first term)', description: 'Served two terms as club president, leading the construction of the VK3SOL club repeater on Mount Major.', isHighlight: false },
      { profileId: vk3tom.id, year: 1983, title: 'Ash Wednesday emergency communications', description: 'Operated for 36 consecutive hours during the Ash Wednesday bushfires, relaying over 400 welfare messages. Awarded Certificate of Appreciation by the State Emergency Service.', isHighlight: true },
      { profileId: vk3tom.id, year: 1991, title: 'Morse code instructor for WIA', description: 'Began teaching Morse code and amateur theory for the Wireless Institute of Australia\'s novice program.', isHighlight: false },
      { profileId: vk3tom.id, year: 2005, title: 'No-code licence era begins', description: 'Continued to promote CW operation despite the removal of the Morse requirement, running weekly CW nets on 7.030 MHz.', isHighlight: false },
      { profileId: vk3tom.id, year: 2010, title: 'SADARC Life Membership', description: 'Awarded Life Membership in recognition of 49 years of service to the club and the amateur radio community.', isHighlight: true },
      { profileId: vk3tom.id, year: 2019, title: 'Became a Silent Key', description: 'Tom passed away peacefully at Goulburn Valley Health, Shepparton, in January 2019. His final QSO was on New Year\'s Day, 2019 — an 80-metre contact with his old friend VK2AX.', isHighlight: true },
    ],
    skipDuplicates: true,
  })

  // Equipment for VK3TOM
  await prisma.equipmentItem.createMany({
    data: [
      {
        profileId: vk3tom.id,
        name: 'Collins 75S-3B Receiver',
        model: 'Collins 75S-3B',
        yearsOwned: '1965–2019',
        description: 'Tom\'s prized HF receiver, covering 500 kHz to 30 MHz. He maintained it meticulously and it was still in daily use at the time of his passing.',
        provenance: 'Purchased new from Collins Radio dealer in Melbourne, 1965. Currently held by SADARC for display.',
      },
      {
        profileId: vk3tom.id,
        name: 'Collins 32S-3 Transmitter',
        model: 'Collins 32S-3',
        yearsOwned: '1965–1988',
        description: 'The transmitting half of his legendary Collins S-Line station. Replaced in 1988 with a solid-state rig but Tom always maintained it was never quite the same.',
        provenance: 'Sold to VK3RF in 1988. Current whereabouts unknown.',
      },
      {
        profileId: vk3tom.id,
        name: 'Yaesu FT-DX3000',
        model: 'Yaesu FT-DX3000',
        yearsOwned: '2012–2019',
        description: 'His final HF transceiver, used in the last years of his life. He appreciated the DSP noise reduction for his increasingly sensitive hearing.',
        provenance: 'Bequeathed to his grandson Dylan (now studying for his licence).',
      },
      {
        profileId: vk3tom.id,
        name: 'Home-brew 80m Dipole',
        model: 'Home construction',
        yearsOwned: '1960–2019',
        description: 'A centre-fed dipole cut for 80 metres, rebuilt several times over the decades but always to the same dimensions Tom first calculated in 1960. His 80-metre antenna was considered one of the best in the region.',
        provenance: 'Dismantled after the property was sold; wire donated to SADARC.',
      },
    ],
    skipDuplicates: true,
  })

  // Oral history for VK3TOM
  await prisma.oralHistoryEntry.createMany({
    data: [
      {
        profileId: vk3tom.id,
        question: 'What drew you to amateur radio in the first place?',
        answer: 'I heard a distant station on a crystal set I\'d built from an old tobacco tin and some wire, and that was it. I was fifteen. The idea that you could talk to someone hundreds of miles away with something you\'d made yourself — that never got old. Not in sixty years.',
        yearRecorded: 2015,
      },
      {
        profileId: vk3tom.id,
        question: 'Can you describe the Ash Wednesday operation?',
        answer: 'It was chaos, but organised chaos. The phones were down across half the valley. We had people trying to find out if their families were safe. I just kept the key moving and the log going. Thirty-six hours. Jean kept bringing me tea and sandwiches. I don\'t think I ate most of them. When it was over I slept for fourteen hours straight. I\'d do it again in a heartbeat.',
        yearRecorded: 2015,
      },
      {
        profileId: vk3tom.id,
        question: 'What do you think is the most important thing to pass on to new operators?',
        answer: 'Patience. With the propagation, with the equipment, with yourself. And listen before you transmit — always. You\'d be surprised how much of this hobby is about listening.',
        yearRecorded: 2017,
      },
    ],
    skipDuplicates: true,
  })

  // Tributes for VK3TOM
  await prisma.tribute.createMany({
    data: [
      {
        profileId: vk3tom.id,
        authorName: 'Peter Walsh',
        authorCallsign: 'VK2AX',
        content: 'Tom was my first QSO when I got my ticket in 1959. Sixty years of friendship across the ether. The 80-metre net will never sound the same without his fist on the key. 73, old friend.',
        approved: true,
      },
      {
        profileId: vk3tom.id,
        authorName: 'Sandra Reid',
        authorCallsign: 'VK3RD',
        content: 'Tom was my Elmer. I was terrified on my first transmission and he talked me through it for half an hour. Patient, encouraging, funny. Everything that is best about this hobby I learned from him. The world is quieter without VK3TOM in it.',
        approved: true,
      },
      {
        profileId: vk3tom.id,
        authorName: 'SADARC Committee',
        authorCallsign: 'VK3SOL',
        content: 'Tom Mitchell was a founding member of this club and its heart for over fifty years. His Saturday morning workshops introduced hundreds of people to the technical side of the hobby. We have named our new antenna workshop the "Mitchell Workshop" in his honour.',
        approved: true,
      },
    ],
    skipDuplicates: true,
  })

  // Club memberships for VK3TOM
  await prisma.clubMembership.createMany({
    data: [
      { profileId: vk3tom.id, clubName: 'Shepparton and District Amateur Radio Club', clubCall: 'VK3SOL', years: '1961–2019', role: 'Life Member; President 1972–74, 1981–83' },
      { profileId: vk3tom.id, clubName: 'Wireless Institute of Australia', clubCall: 'WIA', years: '1958–2019', role: 'Member' },
      { profileId: vk3tom.id, clubName: 'VK CW Club', clubCall: 'VKCC', years: '1990–2019', role: 'Member' },
    ],
    skipDuplicates: true,
  })

  // VK2AX — Peter Walsh (connected operator)
  const vk2ax = await prisma.operatorProfile.upsert({
    where: { callsign: 'VK2AX' },
    update: {},
    create: {
      callsign: 'VK2AX',
      name: 'Peter Walsh',
      born: 1938,
      died: 2022,
      locationQth: 'Sydney, New South Wales',
      isDraft: false,
      isUnclaimed: true,
      biography: 'Peter Walsh, VK2AX, was a prominent CW operator and contester from Sydney. Known for his precise sending style and encyclopaedic knowledge of propagation, Peter mentored dozens of operators over his sixty-three-year career on the bands.',
    },
  })

  // VK4RF — Ray Franklin
  const vk4rf = await prisma.operatorProfile.upsert({
    where: { callsign: 'VK4RF' },
    update: {},
    create: {
      callsign: 'VK4RF',
      name: 'Raymond "Ray" Franklin',
      born: 1942,
      died: 2021,
      locationQth: 'Toowoomba, Queensland',
      isDraft: false,
      isUnclaimed: true,
      biography: 'Ray Franklin operated from Toowoomba for over fifty years. He was especially known for his DX work and held DXCC on five bands.',
    },
  })

  // Connections
  await prisma.operatorConnection.createMany({
    data: [
      {
        fromProfileId: vk3tom.id,
        toProfileId: vk2ax.id,
        relationshipType: 'club_friend',
        description: 'First QSO in 1959; remained regular skeds on 80m for sixty years.',
      },
      {
        fromProfileId: vk3tom.id,
        toProfileId: vk4rf.id,
        relationshipType: 'elmer',
        description: 'Tom helped Ray work through antenna theory during his novice years in the early 1960s.',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✓ Seed complete. Profiles: VK3TOM, VK2AX, VK4RF')
  console.log('✓ Demo login: demo@silentkey.net.au / silentkey2024')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
