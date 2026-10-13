import { Project, Service, JournalPost, ClientExperience, BeforeAfterPlaceCard } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'obsidian-villa',
    title: 'The Obsidian Villa',
    location: 'Ikoyi, Lagos',
    category: 'Residential',
    clientName: 'Dr. Kunle A',
    year: '2025',
    description: 'A striking structural masterpiece balancing deep obsidian marbles, warm brass elements, and expansive double-height glass panels. The client wanted a private sanctuary that was both imposing and profoundly welcoming.',
    mainImage: 'https://cdn.phototourl.com/member/2026-10-12-660aeb35-c950-44c3-9b0a-d60017dfc312.jpg',
    beforeImage: 'https://cdn.phototourl.com/member/2026-10-12-89eb7df6-58d8-41cd-ba0c-2be4f3d292f3.jpg',
    afterImage: 'https://cdn.phototourl.com/member/2026-10-12-63dd9d02-b986-4cee-b2b9-c5c2e7fed987.jpg',
    beforeName: 'Original Bare Site Shell',
    afterName: 'Sculpted Obsidian Villa',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-12-660aeb35-c950-44c3-9b0a-d60017dfc312.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-6919a1ee-c97d-42fb-bcfd-9054eff6966e.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-afc2af71-d3c8-4814-b0eb-38480342b98c.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-fd809a71-25ed-4d9a-81a2-f2dc1ef5ca9e.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-8d611b18-092b-487e-96a8-dfaeaf16826e.jpg'
    ],
    challenges: 'The main architectural challenge was optimizing natural daylight while minimizing severe thermal gain from Lagos afternoon sun. Additionally, the existing site had irregular plumbing grids that restricted master bath layout expectations.',
    solutions: 'We implemented custom-engineered high-performance low-E glass glazing framed in minimalist black metal. By relocating the wet walls and finishing the space in premium local terrazzo integrated with imported Italian marble slabs, we achieved a seamless transition of elements.',
    materials: ['Calacatta Nero Marble', 'Brushed Champagne Brass', 'Handcrafted Smoked Oak Panels', 'Premium Terrazzo Flooring'],
    clientQuote: 'SpacePro did not just finish our villa; they sculpted an entire daily experience of calm. Every corner feels intentional and deeply refined.'
  },
  {
    id: 'ivory-residence',
    title: 'The Ivory Residence',
    location: 'Banana Island, Lagos',
    category: 'Residential',
    clientName: 'Chief Sandra A',
    year: '2026',
    description: 'A luminous residential sanctuary wrapped in soft neutral bouclés, brushed limestone floors, and bespoke hand-applied plaster textures. Centered around spaciousness and organic high-end materials.',
    mainImage: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', // raw concrete interior
    afterImage: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
    beforeName: 'Raw Concrete Framing & Shell',
    afterName: 'Bespoke Ivory Living Sanctuary',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-eb575210-0f61-4560-a3cf-2d4fc2616019.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-1880993b-886e-4ecc-a5ed-e9f0816d80b5.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-d80b3353-3383-451e-ab21-21b1eedde7f5.jpg',
      'https://cdn.phototourl.com/member/2026-10-12-cb62d73b-ee29-4c34-a53c-bd2b9e11b23a.jpg'
    ],
    challenges: 'Creating acoustic isolation in an open-concept structure with high ceilings and extensive hard plaster surfaces without compromising the visual cleanliness of the minimal ceiling lines.',
    solutions: 'A coustic absorption micro-perforated backings were hidden behind custom fabric wall panelings and structural wooden fins, blending functional insulation directly into the premium architectural decor.',
    materials: ['Jura Beige Limestone', 'Bespoke Lime Plaster Walls', 'Natural Bouclé Fabrics', 'Stained White Oak cabinetry'],
    clientQuote: 'The air in this home feels lighter. SpacePro captured our desire for peace, translating it into a flawless architectural masterwork.'
  },
  {
    id: 'apex-lounge',
    title: 'Apex Executive Suite',
    location: 'Victoria Island, Lagos',
    category: 'Commercial',
    clientName: 'Vanguard Capital Partners',
    year: '2025',
    description: 'An elite multi-functional corporate suite and private executive lounge tailored for high-profile client engagement. Styled with rich walnut, acoustic felt panels, and subtle custom leather alignments.',
    mainImage: 'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // building site structure
    afterImage: 'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
    beforeName: 'Industrial Concrete Commercial Slab',
    afterName: 'Prestige Executive Acoustic Lounge',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-b5ebbd2b-d3c3-4da8-a13c-793f0227b45b.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-398c4268-1cb9-4710-ad06-f3dbdd550ddb.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-2741cc77-8da4-4c06-826e-e008dbe6cc83.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-47e29836-c6eb-4669-9b3d-9045085ee800.jpg'
    ],
    challenges: 'A tight 60-day construction window within a fully operational luxury corporate tower, meaning zero noise or vibration during traditional business hours.',
    solutions: 'A precise turnkey staging system where all bespoke furniture joinery and wall panelings were pre-fabricated off-site at our high-tech workshop and rapidly fitted overnight.',
    materials: ['American Black Walnut', 'Full-Grain Italian Leather', 'Acoustic Wool-Felt Panels', 'Fluted Architectural Glass'],
    clientQuote: 'SpacePro executed a flawless construction turnaround with perfect communication. The finishes are absolutely peerless.'
  },
  {
    id: 'eko-penthouse',
    title: 'Aura Bespoke Penthouse',
    location: 'Eko Atlantic, Lagos',
    category: 'Furnishing',
    clientName: 'Tunde & Amara Coker',
    year: '2026',
    description: 'A custom turn-key interior design and luxury furnishing suite overlooking the Atlantic. We curated and custom-built low-profile statement sofas, monolithic dining tables, and delicate lighting systems.',
    mainImage: 'https://cdn.phototourl.com/member/2026-08-26-49b38adc-2791-4236-8177-673f823c2e5c.jpg',
    beforeImage: 'https://cdn.phototourl.com/member/2026-08-26-456c5afc-abc5-44de-8cc2-8e79838a5a51.png',
    afterImage: 'https://cdn.phototourl.com/member/2026-08-26-49b38adc-2791-4236-8177-673f823c2e5c.jpg',
    beforeName: 'Bare High-Rise Glazing & Concrete Deck',
    afterName: 'Oceanfront Travertine Penthouse',
    galleryImages: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    challenges: 'Import restrictions and maritime logistics delays on critical luxury designer fixtures selected early in the architectural process.',
    solutions: 'We leveraged our robust local premium artisans network to custom manufacture identical premium timber frames and custom brass metal joineries right in Lagos, exceeding standard quality metrics.',
    materials: ['Honed Travertine', 'Saddle Leather Cords', 'Bespoke Cast Bronze Fixtures', 'Belgian Linen Drapes'],
    clientQuote: 'They made Eko Atlantic feel like a warm, handcrafted home rather than an glass box. Exceptional taste and outstanding dedication.'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'interior-design',
    name: 'Luxury Interior Design',
    title: 'Aesthetic Spatial Artistry',
    tagline: 'We synthesize layout, texture, light, and luxury furniture to craft highly personalized spaces.',
    description: 'Our design studio creates bespoke architectural layouts. From detailed 3D spatial elevations and moodboards to premium materials sourcing, we define the sensory atmosphere of your home, yacht, or commercial lounge.',
    brochureImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Full custom 3D high-fidelity visualizations and architectural drafting.',
      'Sourcing access to exclusive European and global design houses.',
      'Personalized tactile material consultations (stone, wood, finishes, textiles).',
      'Ergonomic spatial optimization tailored to your daily biological rhythm.'
    ],
    processSteps: [
      { step: '01', title: 'Conceptualization', description: 'Deep exploration of your design vision, sensory preferences, and spatial aspirations.' },
      { step: '02', title: 'Spatial Drafting', description: 'Architectural space planning, volume creation, and custom joinery detailing.' },
      { step: '03', title: 'Material Integration', description: 'Tactile mapping of exquisite stone, textured plasters, metal alloys, and fine timber.' },
      { step: '04', title: 'Visual Renderings', description: 'Hyper-realistic digital modeling so you can experience your home before breaking ground.' }
    ],
    faqs: [
      { question: 'What is the standard duration for a complete villa design phase?', answer: 'A custom, premium residential project design phase usually spans 4 to 8 weeks, depending on total square footage and bespoke features.' },
      { question: 'Do you design custom, built-in joinery?', answer: 'Yes, absolutely. We draft custom wardrobes, master bedroom vanities, paneling, and secret doors, which are crafted to millimeter accuracy in our Lagos mill.' }
    ]
  },
  {
    id: 'turnkey-renovation',
    name: 'Turnkey Renovation',
    title: 'Bespoke Structural Transformations',
    tagline: 'Perfect orchestration of civil demolition, structural reinforcement, and exquisite luxury finishes.',
    description: 'We handle complete property overhauls from initial layout redesign to finishing. No dealing with multiple subcontractors. We manage technical plumbing, electrical grids, walls, smart-home automation, and high-end surfaces in-house.',
    brochureImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Single source of accountability from heavy demolition to final polish.',
      'In-house certified structural engineers, plumbers, and high-precision tilers.',
      'Detailed daily digital site logs and live structural camera access.',
      'Fixed pricing structures with transparent cost protection models.'
    ],
    processSteps: [
      { step: '01', title: 'Site Forensic Analysis', description: 'In-depth assessment of the structural, plumbing, and electrical status of the host space.' },
      { step: '02', title: 'Engineering Layouts', description: 'Finalizing technical drawings, load-bearing validations, and structural wall openings.' },
      { step: '03', title: 'Civil Execution', description: 'Demolition, structural updates, high-precision concrete, and premium services plumbing.' },
      { step: '04', title: 'Exquisite Surfaces', description: 'Installing large-format marble slabs, micro-cement, premium moldings, and hand-applied plaster.' }
    ],
    faqs: [
      { question: 'Can we reside in the house during a turnkey renovation?', answer: 'For safety, air quality, and speed of execution, we strongly recommend that the property is completely unoccupied during major turnkey transformations.' },
      { question: 'How do you handle unforeseen structural issues?', answer: 'Every project includes a forensic assessment prior to contract signing, drastically reducing surprises. Any minor issue is logged instantly with full solutions and budget transparency.' }
    ]
  },
  {
    id: 'space-finishing',
    name: 'Space Finishing',
    title: 'Bespoke Architectural Finishes',
    tagline: 'The delicate layer that elevates raw concrete and drywall into absolute tactile refinement.',
    description: 'The difference between an average home and a luxury masterwork lies in the finishing. We are recognized leaders in precision stone fabrication, marble bookmatching, Venetian plasters, micro-topping, and trim detailing.',
    brochureImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Master stone craftsmen specializing in Calacatta and Travertine bookmatching.',
      'Authentic Venetian polished plaster and custom texture applications.',
      'Millimeter-precision flush skirting, shadow gaps, and hidden light channels.',
      'Premium paint coatings, multi-layered lacquers, and metal patination.'
    ],
    processSteps: [
      { step: '01', title: 'Surface Forensics', description: 'Verifying laser level alignments of all raw masonry walls, floors, and ceilings.' },
      { step: '02', title: 'Stone Selection & Sourcing', description: 'Visiting global stone yards or our hand-picked warehouse to source raw blocks.' },
      { step: '03', title: 'Laser Precision Cutting', description: 'Water-jet cutting and alignment mockup to ensure perfect bookmatching and zero visible seams.' },
      { step: '04', title: 'Textural Artistry', description: 'Applying multiple thin layers of Venetian plaster or micro-cement, finished in protective wax.' }
    ],
    faqs: [
      { question: 'Do you finish existing, pre-built structural developer shells?', answer: 'Yes, this is one of our main specialties. We take bare concrete developer shells in Lagos (Lekki, Ikoyi, Victoria Island) and turn them into world-class residential masterpieces.' },
      { question: 'What is Venetian plaster, and why is it premium?', answer: 'It is a lime-putty plaster blended with marble dust. Applied by hand in 5-7 ultra-thin layers, burnished to a stone-smooth, luminous finish that ages beautifully over centuries.' }
    ]
  },
  {
    id: 'furnishing',
    name: 'Curated Furnishing & Styling',
    title: 'The Soul of Exceptional Living',
    tagline: 'Sourcing and manufacturing premium loose furniture, decorative lighting, and original art.',
    description: 'We believe furniture is functional sculpture. We curate unique vintage acquisitions, exclusive imports, and custom-manufactured sofas, tables, and cabinets designed specifically for the architectural scale of your room.',
    brochureImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    benefits: [
      'Bespoke furniture sizing to fit the precise volumetric scale of your rooms.',
      'Premium custom fabric selections (Belgian linens, Italian bouclés, full-grain leathers).',
      'Sourcing unique bespoke lighting sculptures from around the globe.',
      'Art-consulting and curation of outstanding West African and international artists.'
    ],
    processSteps: [
      { step: '01', title: 'Sartorial Briefing', description: 'Understanding how you lounge, host, work, and dine to define the tactile comfort profiles.' },
      { step: '02', title: 'Volume & Scale Mapping', description: 'Drafting precise furniture floor plans to ensure comfortable, spacious flow in every space.' },
      { step: '03', title: 'Curation & Manufacture', description: 'Hand-selecting fabrics, crafting timber frames, and assembling original luxury pieces.' },
      { step: '04', title: 'The Reveal styling', description: 'Delivering, placing, styling, and accessorizing the space down to books, vessels, and organic accents.' }
    ],
    faqs: [
      { question: 'Do you offer custom-made sofas and beds?', answer: 'Yes, we operate a private high-end carpentry workshop where we manufacture solid timber frames finished with dense dual-comfort feathers and luxury foam.' },
      { question: 'Can you integrate existing family heirlooms?', answer: 'Absolutely. A luxury space should tell your story. We love integrating, reupholstering, or re-styling treasured personal artifacts.' }
    ]
  }
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'art-of-bookmatching',
    title: 'The Art of Bookmatching: Elevating Stone to Architectural Art',
    category: 'Design Inspiration',
    date: 'June 18, 2026',
    author: 'Tosin Williams, Design Director',
    readTime: '6 min read',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    summary: 'When marble blocks are split and polished, aligning their natural veins creates mirrors of breathtaking complexity. Discover how we select, cut, and install these magnificent materials.',
    paragraphs: [
      'In high-end architectural finishing, marble is not simply a flooring material. It is a biological canvas created by nature over millions of years. To capture its true majesty, luxury interior designers turn to bookmatching—the practice of matching two or more stone slabs so that their venations mirror one another.',
      'The process begins at the Italian quarry. We hand-select continuous blocks of Calacatta, Arabescato, or quartzite. Every block has a unique fingerprint. If a slab is sliced sequentially, we can align the pieces in pairs—representing an open book.',
      'Installing bookmatched marble requires millimetric precision. If the vein lines are off by even two millimeters, the visual mirror is broken, and the human eye instantly spots the error. This is why our in-house masons use precise 3D digital mappings before a water-jet ever touches the stone.',
      'When executed flawlessly, a bookmatched wall in a foyer or shower becomes the definitive focal point of the home, transforming a structural wall into an interactive monument of timeless luxury.'
    ],
    quote: 'Marble is the structural memory of the earth. Bookmatching is how we allow that memory to speak in perfect architectural symmetry.'
  },
  {
    id: 'banana-island-penthouses',
    title: 'Minimalist Penthouses: Navigating Light and Space in Lagos',
    category: 'Luxury Living',
    date: 'May 24, 2026',
    author: 'Amara Nwachukwu, Senior Architect',
    readTime: '8 min read',
    previewImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    summary: 'Luxury in coastal urban climates is defined by generous volume, airflow, and a calm, clean palette. We explore the structural finishing of Eko Atlantic and Banana Island.',
    paragraphs: [
      'Lagos is a high-energy city. For the affluent homeowner, return-on-investment is not just financial; it is sensory. Coming home to a space that is silent, bright, and uncluttered is the ultimate luxury in our modern, bustling metropolis.',
      'We focus on high ceilings, floor-to-ceiling double glazing, and an open floor plan. To avoid a sterile feel, we replace traditional drywall paint with hand-troweled lime wash and Venetian plaster. These organic finishes capture changing Lagos sea light in soft, textured gradients.',
      'Furniture placement is kept minimal, emphasizing low-profile sofas in textured linen and travertine blocks. This allows the eye to sweep unimpeded across the vast horizons of the lagoon, grounding the home in its unique coastal context.'
    ]
  },
  {
    id: 'materials-matter',
    title: 'Materials Matter: Why Bouclé, Travertine, and Brass Endure',
    category: 'Interior Trends',
    date: 'April 12, 2026',
    author: 'Nnamdi Okafor, Curation Lead',
    readTime: '5 min read',
    previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    summary: 'While synthetic designs fluctuate, raw materials with high tactile feedback retain their emotional value. Learn why we prioritize authentic textures over superficial styles.',
    paragraphs: [
      'Trends come and go, but authentic textures have an eternal pull. A plastic surface is cold; it does not change with use, and it is easily discarded. Travertine stone, unlacquered brass, and raw bouclé wool tell stories of physical creation.',
      'Unlacquered brass oxidizes gracefully, developing a rich, darker patina where hands frequently touch it. Travertine has unique volcanic pockets that create soft shadow effects. Bouclé fabric, woven from twisted wool loops, invites touch and softens sharp architectural angles.',
      'When designing luxury spaces, we ensure that every primary point of human contact—the door handles, the kitchen countertop, the primary sofa—is crafted from a material that responds to touch with elegance and prestige.'
    ],
    quote: 'We do not live in digital renders; we live in tactile reality. A luxury space must satisfy the skin as much as the eye.'
  }
];

export const CLIENT_EXPERIENCES: ClientExperience[] = [
  {
    id: 'alao-experience',
    clientName: '',
    role: 'Vascular & Medical Sanctuary Curation',
    location: 'Ikoyi, Lagos',
    projectTitle: 'The Obsidian Villa',
    quote: 'SpacePro transformed our raw concrete building shell into an architectural sanctuary. Their focus on the tiny details—the door transitions, the plaster textures, the stone bookmatching—was absolute artistry.',
    transformationSummary: 'A 7,500 sq ft concrete villa structural framework required complete space finishing, smart electrical design, and elegant modern curation.',
    image: 'https://cdn.phototourl.com/member/2026-10-12-52430969-9c41-4e6f-8b5c-c28464d919c1.jpg',
    achievement: 'Delivered in 120 days, on budget, with custom stone structures flown from Carrara and finished locally in Lagos.'
  },
  {
    id: 'adeleke-experience',
    clientName: '',
    role: 'Luxury Residential Development',
    location: 'Banana Island, Lagos',
    projectTitle: 'The Ivory Residence',
    quote: 'Having built luxury properties for fifteen years, I have never seen this standard of finish in Nigeria. SpacePro works with surgical accuracy. They are our definitive design partner going forward.',
    transformationSummary: 'Creating a bright, tranquil, highly acoustic luxury family mansion focusing on sensory calm and spacious flow.',
    image: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
    achievement: 'Integrated invisible acoustic absorption panelling, continuous seamless flooring, and high-performance climate glazing.'
  },
  {
    id: 'jane-experience',
    clientName: '',
    role: 'Private Living Suite Curation',
    location: 'Lagos',
    projectTitle: 'Contemporary Living Sanctuary',
    quote: 'Sometimes, luxury isn’t about being surrounded by expensive things. It’s about finding peace in the little moments, sinking into a comfortable chair, enjoying the warmth of beautiful lighting, and allowing yourself to breathe after a long day.\n\nEvery detail in this living room tells a story. From the rich textures of the furniture and the warmth of the wooden wall panels to the statement pendant lighting and carefully layered colours, the space blends contemporary elegance with everyday comfort.\n\nThis is more than interior design. It’s a lifestyle where comfort meets sophistication, and every corner invites you to slow down, unwind, and feel at home.',
    transformationSummary: 'Bespoke contemporary living suite pairing warm wooden wall paneling, sculpted furnishings, and statement lighting.',
    image: 'https://cdn.phototourl.com/member/2026-10-12-ecd5e7b0-d8d6-49ab-8c15-bbbf396c68f8.jpg',
    achievement: 'Layered warm ambient lighting, rich timber acoustic paneling, and tactile furnishings for timeless relaxation.'
  },
  {
    id: 'grand-vista-experience',
    clientName: '',
    role: 'Waterfront Architectural Residence',
    location: 'Epe Waterfront, Lagos',
    projectTitle: 'The Grand Vista Sanctuary',
    quote: 'An extraordinary integration of waterfront views, soaring architectural ceilings, and bespoke Italian marble finishes. Every space flows seamlessly into the next, balancing grandeur with intimate warmth.',
    transformationSummary: 'A complete architectural transformation featuring multi-level open-plan living, custom acoustic timber paneling, and floor-to-ceiling panoramic glazing.',
    image: 'https://cdn.phototourl.com/member/2026-10-13-1b01b135-769a-45bb-8c9e-6d845ec09808.jpg',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-13-059735b7-a757-465b-a0e3-d60d691f7717.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-a8a0f589-6755-4ef8-8304-4868d69850ed.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-a371bfa9-dff9-4d63-8392-81cffdeab6d9.jpg'
    ],
    achievement: 'Delivered with meticulous attention to detail, integrating sustainable climate engineering and bespoke handcrafted millwork.'
  },
  {
    id: 'azure-horizon-experience',
    clientName: '',
    role: 'Penthouses & Sky Villa Curation',
    location: 'Eko Atlantic, Lagos',
    projectTitle: 'The Azure Horizon Sky Villa',
    quote: 'An exquisite curation of suspended sky architecture, combining ultra-clear panoramic glazing, hand-polished travertine surfaces, and seamless indoor-outdoor living that captures the essence of coastal serenity.',
    transformationSummary: 'A luxury raw shell penthouse transformed into a breathtaking coastal sanctuary with custom millwork, integrated acoustic solutions, and statement lighting.',
    image: 'https://cdn.phototourl.com/member/2026-10-13-2bd1cbb1-e812-459f-80da-e6ec67d0c875.jpg',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-13-25b9f4e0-0006-46ea-8efd-9e01d5cc9da5.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-59b334db-0e29-48de-bdf0-4263a5aa6c1b.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-12ec0efd-e20f-4f33-be09-1d1734513946.jpg'
    ],
    achievement: 'Executed with precision glass engineering and bespoke timber finishes, delivered seamlessly on schedule.'
  },
  {
    id: 'celestial-heights-experience',
    clientName: '',
    role: 'Luxury Residential Sanctuary Curation',
    location: 'Victoria Island, Lagos',
    projectTitle: 'The Celestial Heights Residence',
    quote: 'A masterpiece of contemporary sophistication, where expansive architectural volumes meet refined organic textures, creating an ambiance of transcendent luxury and effortless elegance.',
    transformationSummary: 'A premier residential development meticulously curated with bespoke architectural lighting, seamless spatial flow, and exquisite material craftsmanship.',
    image: 'https://cdn.phototourl.com/member/2026-10-13-25eed7c0-97d6-48bc-bcef-c28e77f0360d.jpg',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-13-64265f1a-fc40-48aa-b253-ab745962b97f.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-77cc3d52-d80d-4fe9-8cf1-1415036a537e.jpg'
    ],
    achievement: 'Delivered with uncompromising attention to detail and world-class interior finishing standards.'
  },
  {
    id: 'port-harcourt-residence',
    clientName: '',
    role: 'Executive Waterfront Residence Curation',
    location: 'Port Harcourt',
    projectTitle: 'The Port Harcourt Crown Residence',
    quote: 'An exquisite architectural masterpiece located in Port Harcourt, seamlessly blending contemporary structural refinement with warm organic materiality and bespoke luxury finishes.',
    transformationSummary: 'A premier architectural development transformed with luxurious marble accents, refined custom millwork, statement lighting, and immaculate spatial harmonization.',
    image: 'https://cdn.phototourl.com/member/2026-10-13-c667d700-2ed2-479d-99f0-6d712d0180dc.jpg',
    galleryImages: [
      'https://cdn.phototourl.com/member/2026-10-13-2ed8dce7-660c-4b5c-b71d-f4e2633fc97d.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-b74bf479-9163-481b-acf6-a638581d4409.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-0d1c06a6-c5ac-418a-973f-8034631da56d.jpg',
      'https://cdn.phototourl.com/member/2026-10-13-8427856a-8817-47ff-ba03-7a4ae669a6a1.jpg'
    ],
    achievement: 'Executed with precision architectural joinery and world-class interior engineering standards, delivered flawlessly.'
  }
];

export const STATISTICS = [
  { value: '120+', label: 'Delivered Masterpieces' },
  { value: '98%', label: 'Loyal Client Retention' },
  { value: '15+', label: 'Years of Design Mastery' },
  { value: '.........', label: 'Assets Transformed' }
];

export const BEFORE_AFTER_PLACES: BeforeAfterPlaceCard[] = [
  {
    id: 'place-obsidian-villa',
    placeName: 'The Obsidian Villa',
    location: 'Ikoyi, Lagos',
    category: 'Residential Villa',
    beforeName: 'Original Bare Site Shell',
    afterName: 'Sculpted Obsidian Masterpiece',
    beforeImage: 'https://cdn.phototourl.com/member/2026-10-12-89eb7df6-58d8-41cd-ba0c-2be4f3d292f3.jpg',
    afterImage: 'https://cdn.phototourl.com/member/2026-10-12-63dd9d02-b986-4cee-b2b9-c5c2e7fed987.jpg',
    description: 'Bare hollow-block partitioning and exposed conduit grids transformed into deep Calacatta Nero marble, acoustic smoked oak, and champagne brass.'
  },
  {
    id: 'place-ivory-residence',
    placeName: 'The Ivory Residence',
    location: 'Banana Island, Lagos',
    category: 'Luxury Mansion',
    beforeName: 'Raw Concrete Framing & Shell',
    afterName: 'Bespoke Ivory Living Sanctuary',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://cdn.phototourl.com/member/2026-10-12-dcb7bdeb-a9b4-4216-a8c3-a5ff37b8e0f6.jpg',
    description: 'Unrendered structural columns and cold masonry converted into light-bathed travertine floors, hand-applied lime plaster, and organic bouclé finishes.'
  },
  {
    id: 'place-contemporary-living',
    placeName: 'Contemporary Elegance Suite',
    location: 'Lagos',
    category: 'Living Space Renovation',
    beforeName: 'Original Unfinished Living Shell',
    afterName: 'Finished Contemporary Elegance',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://cdn.phototourl.com/member/2026-10-12-ecd5e7b0-d8d6-49ab-8c15-bbbf396c68f8.jpg',
    description: 'Warm fluted timber wall panels, curated statement pendant lighting, and soft layered colors crafted for peace, unwinding, and refined everyday luxury.'
  },
  {
    id: 'place-apex-lounge',
    placeName: 'Apex Executive Suite',
    location: 'Victoria Island, Lagos',
    category: 'Commercial Suite',
    beforeName: 'Industrial Concrete Commercial Slab',
    afterName: 'Prestige Executive Acoustic Lounge',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://cdn.phototourl.com/member/2026-10-13-c81e2d2e-2cc8-49ad-a7f2-380a3a6571af.jpg',
    description: 'Precision turnkey staging and acoustic joinery fitted overnight over an open unfinished industrial commercial concrete floor.'
  },
  {
    id: 'place-aura-penthouse',
    placeName: 'Aura Bespoke Penthouse',
    location: 'Eko Atlantic, Lagos',
    category: 'Oceanfront Penthouse',
    beforeName: 'Bare High-Rise Glazing & Concrete Deck',
    afterName: 'Oceanfront Travertine Penthouse',
    beforeImage: 'https://cdn.phototourl.com/member/2026-08-26-456c5afc-abc5-44de-8cc2-8e79838a5a51.png',
    afterImage: 'https://cdn.phototourl.com/member/2026-08-26-49b38adc-2791-4236-8177-673f823c2e5c.jpg',
    description: 'Monolithic travertine dining features, tailored low-profile bouclé seating, and bronze fittings elevating an empty high-rise coastal envelope.'
  }
];
