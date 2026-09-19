import {
  Smartphone,
  Coffee,
  Fan,
  Lamp,
  Blend,
  Wrench,
  Headphones,
  Laptop,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "phone"
  | "kettle"
  | "fan"
  | "lamp"
  | "blender"
  | "headphones"
  | "laptop"
  | "other";

export type SafetyLevel = "safe" | "caution" | "avoid";
export type RepairStatus = "fixed" | "in-progress" | "needs-pro";

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  hint: string;
}

export interface RepairStep {
  title: string;
  detail: string;
}

export interface RepairResult {
  id: string;
  category: CategoryId;
  productName: string;
  issue: string;
  summary: string;
  safety: SafetyLevel;
  safetyNote: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  tools: string[];
  steps: RepairStep[];
  wasteSavedKg: number;
  moneySaved: number;
  description: string;
  imageName?: string;
  createdAt: string;
  status: RepairStatus;
}

export const categories: Category[] = [
  { id: "phone", label: "Phone", icon: Smartphone, hint: "Screens, batteries, ports" },
  { id: "kettle", label: "Kettle", icon: Coffee, hint: "Won't heat, leaks, switch" },
  { id: "fan", label: "Fan", icon: Fan, hint: "Noise, wobble, dead motor" },
  { id: "lamp", label: "Lamp", icon: Lamp, hint: "Flicker, switch, socket" },
  { id: "blender", label: "Blender", icon: Blend, hint: "Jams, leaks, burnt smell" },
  { id: "headphones", label: "Headphones", icon: Headphones, hint: "One side out, crackle" },
  { id: "laptop", label: "Laptop", icon: Laptop, hint: "Slow, hot, no charge" },
  { id: "other", label: "Other", icon: Wrench, hint: "Anything else at home" },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;

export const safetyMeta: Record<
  SafetyLevel,
  { label: string; short: string; description: string }
> = {
  safe: {
    label: "Safe to try",
    short: "Safe",
    description: "Low risk. Unplug first, take your time, and you've got this.",
  },
  caution: {
    label: "Proceed with caution",
    short: "Caution",
    description: "Some risk involved. Follow each step exactly and stop if unsure.",
  },
  avoid: {
    label: "Avoid DIY",
    short: "Seek a pro",
    description: "This involves mains power or batteries. Please get professional help.",
  },
};

export const safetyTips = [
  { title: "Unplug before you open", body: "Always disconnect power and wait 60 seconds." },
  { title: "Swollen battery? Stop.", body: "Puffy or hot batteries are a fire risk — never puncture." },
  { title: "Photograph every step", body: "Snap a pic before removing screws. Future you says thanks." },
  { title: "Water and electronics", body: "Dry for 48 hours before powering anything back on." },
];

export const faqs = [
  {
    q: "Is ReVive's advice safe to follow?",
    a: "Every diagnosis comes with a safety level. 'Safe' repairs are low risk when unplugged. 'Caution' repairs need care. 'Avoid DIY' means stop and call a professional.",
  },
  {
    q: "What should I never repair at home?",
    a: "Anything involving mains wiring, microwave capacitors, swollen lithium batteries, gas appliances, or sealed heating elements. These can seriously hurt you.",
  },
  {
    q: "Will repairing void my warranty?",
    a: "Often yes. If your product is still under warranty, check with the manufacturer first — many offer free repairs.",
  },
  {
    q: "How accurate is the AI?",
    a: "It's a smart first opinion, not a certified technician. Use it to understand the likely problem, then decide with the safety level in mind.",
  },
];

interface Blueprint {
  productName: string;
  issue: string;
  summary: string;
  safety: SafetyLevel;
  safetyNote: string;
  difficulty: RepairResult["difficulty"];
  timeEstimate: string;
  tools: string[];
  steps: RepairStep[];
  wasteSavedKg: number;
  moneySaved: number;
}

const blueprints: Record<CategoryId, Blueprint> = {
  phone: {
    productName: "Smartphone",
    issue: "Charging port clogged with lint",
    summary:
      "Intermittent charging on phones is caused by pocket lint packed into the port about 70% of the time. Good news — it's a five-minute fix.",
    safety: "safe",
    safetyNote: "Power the phone off first and never use metal tools inside the port.",
    difficulty: "Easy",
    timeEstimate: "5–10 min",
    tools: ["Wooden toothpick", "Flashlight", "Can of compressed air"],
    steps: [
      { title: "Power down", detail: "Turn the phone off completely so nothing shorts while you work." },
      { title: "Take a look", detail: "Shine a flashlight into the port. See fuzz packed at the bottom? That's your culprit." },
      { title: "Loosen the lint", detail: "Gently scrape along the port walls with a wooden toothpick. Go slow, never force it." },
      { title: "Blow it clear", detail: "Short bursts of compressed air at an angle to lift the loosened debris out." },
      { title: "Test charge", detail: "Plug in. The cable should click in snugly and charge steadily." },
    ],
    wasteSavedKg: 0.18,
    moneySaved: 120,
  },
  kettle: {
    productName: "Electric kettle",
    issue: "Limescale buildup on the heating plate",
    summary:
      "Slow boiling, clicking noises and early auto shut-off almost always point to limescale. A descaling soak restores it like new.",
    safety: "safe",
    safetyNote: "Unplug first. Never open the base — the heating element lives there.",
    difficulty: "Easy",
    timeEstimate: "30 min (mostly waiting)",
    tools: ["White vinegar or citric acid", "Water", "Soft sponge"],
    steps: [
      { title: "Unplug and cool", detail: "Make sure the kettle is empty, cool and unplugged." },
      { title: "Mix the solution", detail: "Fill halfway with equal parts water and white vinegar." },
      { title: "Boil and soak", detail: "Boil once, then let it sit for 20 minutes. Watch the scale lift." },
      { title: "Rinse thoroughly", detail: "Pour out, wipe the plate with a sponge, and boil fresh water twice to rinse." },
    ],
    wasteSavedKg: 1.1,
    moneySaved: 45,
  },
  fan: {
    productName: "Pedestal fan",
    issue: "Dry motor bearings causing wobble and noise",
    summary:
      "Rattling and slow start-up usually mean the motor shaft needs cleaning and a drop of oil — not a new fan.",
    safety: "caution",
    safetyNote: "You'll remove the blade guard. Keep it unplugged and fingers clear of blade edges.",
    difficulty: "Medium",
    timeEstimate: "25–40 min",
    tools: ["Phillips screwdriver", "Light machine oil", "Microfiber cloth"],
    steps: [
      { title: "Unplug and remove the guard", detail: "Unclip or unscrew the front cage and lift off the blade." },
      { title: "Clean the shaft", detail: "Wipe dust and old grease from the motor shaft with a cloth." },
      { title: "Oil the bearings", detail: "Apply 2–3 drops of light oil where the shaft enters the motor. Spin by hand." },
      { title: "Check the blade hub", detail: "Look for cracks. A cracked hub causes wobble and should be replaced." },
      { title: "Reassemble and test", detail: "Refit blade and guard, plug in, and run on low first." },
    ],
    wasteSavedKg: 2.4,
    moneySaved: 60,
  },
  lamp: {
    productName: "Table lamp",
    issue: "Worn inline switch or loose bulb contact",
    summary:
      "Flickering that changes when you wiggle the switch means the switch is worn. If it flickers when touched near the bulb, the socket tab needs adjusting.",
    safety: "caution",
    safetyNote: "Unplug — not just switch off — before touching the socket. If you see melted plastic or burn marks, stop and seek a pro.",
    difficulty: "Medium",
    timeEstimate: "15–20 min",
    tools: ["Flathead screwdriver", "Replacement inline switch (optional)"],
    steps: [
      { title: "Unplug the lamp", detail: "Remove the bulb and let it cool." },
      { title: "Inspect the socket", detail: "Look for the small brass tab at the bottom. If it's flattened, the bulb can't make contact." },
      { title: "Lift the tab", detail: "Gently pry the tab up about 20 degrees with a flathead screwdriver." },
      { title: "Check the switch", detail: "Wiggle the inline switch. Crackling means it's worn — replace it with a like-for-like part." },
      { title: "Test", detail: "Refit the bulb, plug in, and test. Still flickering? Time for a pro." },
    ],
    wasteSavedKg: 1.6,
    moneySaved: 40,
  },
  blender: {
    productName: "Countertop blender",
    issue: "Worn drive coupling",
    summary:
      "A motor that hums while the blades don't spin means the rubber coupling between base and jar has stripped. It's a cheap replaceable part.",
    safety: "safe",
    safetyNote: "Unplug before touching the base. Never reach into the jar around the blades.",
    difficulty: "Easy",
    timeEstimate: "10–15 min",
    tools: ["Replacement coupling", "Flathead screwdriver or towel", "Wrench"],
    steps: [
      { title: "Unplug and remove the jar", detail: "Lift the jar off. Look at the rubber gear on the base — worn teeth confirm it." },
      { title: "Remove the old coupling", detail: "Hold the motor shaft from below with a towel and unscrew the coupling counter-clockwise." },
      { title: "Fit the new one", detail: "Screw the replacement on hand-tight, then a quarter turn more." },
      { title: "Test", detail: "Jar back on, plug in, pulse briefly. Smooth spin? Done." },
    ],
    wasteSavedKg: 2.0,
    moneySaved: 75,
  },
  headphones: {
    productName: "Wired headphones",
    issue: "Broken wire near the 3.5mm plug",
    summary:
      "Audio in one ear that comes back when you bend the cable near the plug is a classic broken conductor. Resoldering a new plug fixes it for a few dollars.",
    safety: "caution",
    safetyNote: "Soldering irons run at 350°C. Work in a ventilated space and use a stand.",
    difficulty: "Hard",
    timeEstimate: "40–60 min",
    tools: ["Soldering iron", "Replacement 3.5mm plug", "Wire strippers", "Heat-shrink tubing"],
    steps: [
      { title: "Confirm the break", detail: "Play audio and flex the cable near the plug. Cut-outs confirm the break location." },
      { title: "Cut and strip", detail: "Cut 3cm above the plug. Strip and identify left, right and ground wires." },
      { title: "Tin and solder", detail: "Tin each wire, then solder to the matching terminals on the new plug." },
      { title: "Insulate and test", detail: "Shrink the tubing, screw on the housing, and test both channels." },
    ],
    wasteSavedKg: 0.12,
    moneySaved: 50,
  },
  laptop: {
    productName: "Laptop",
    issue: "Dust-clogged cooling fan",
    summary:
      "Loud fans, hot palm rests and sudden slowdowns point to blocked airflow. Clearing the dust drops temperatures dramatically.",
    safety: "caution",
    safetyNote: "Disconnect the battery if it's removable. If the battery is swollen, stop — do not press on it.",
    difficulty: "Medium",
    timeEstimate: "30–45 min",
    tools: ["Precision screwdriver set", "Compressed air", "Soft brush", "Plastic pry tool"],
    steps: [
      { title: "Power off and unplug", detail: "Shut down fully and remove the charger." },
      { title: "Open the bottom panel", detail: "Remove screws in order and photograph the layout. Pry gently along the seam." },
      { title: "Clear the fan and fins", detail: "Hold the fan blade still and blow short bursts through the heatsink fins." },
      { title: "Reassemble", detail: "Panel back on, screws in the same holes, and run a stress test to compare temps." },
    ],
    wasteSavedKg: 2.2,
    moneySaved: 400,
  },
  other: {
    productName: "Household appliance",
    issue: "Power supply or internal fault",
    summary:
      "From your description, this looks like an internal electrical fault. Without opening it we can't be sure — and opening it isn't safe for this kind of device.",
    safety: "avoid",
    safetyNote: "Symptoms like burning smell, sparks or tripping breakers mean mains-level risk. Please contact a qualified repair technician.",
    difficulty: "Hard",
    timeEstimate: "Professional visit",
    tools: ["None — do not open"],
    steps: [
      { title: "Unplug it now", detail: "Disconnect from power and move it away from anything flammable." },
      { title: "Check the basics", detail: "Try a different outlet and inspect the cable for damage. Don't open the casing." },
      { title: "Find a certified repairer", detail: "Search for a local repair café or authorised service centre. Bring your notes from ReVive." },
    ],
    wasteSavedKg: 3.5,
    moneySaved: 0,
  },
};

const dangerWords = ["smoke", "burn", "spark", "swollen", "puff", "fire", "shock", "melt", "smell"];

export function analyzeRepair(input: {
  category: CategoryId;
  description: string;
  imageName?: string;
}): RepairResult {
  const bp = blueprints[input.category];
  const text = input.description.toLowerCase();
  const risky = dangerWords.some((w) => text.includes(w));

  const result: RepairResult = {
    id: `rv_${Date.now().toString(36)}`,
    category: input.category,
    ...bp,
    description: input.description,
    imageName: input.imageName,
    createdAt: new Date().toISOString(),
    status: "in-progress",
  };

  if (risky && input.category !== "other") {
    result.safety = "avoid";
    result.issue = "Possible electrical or battery fault";
    result.safetyNote =
      "You mentioned heat, smoke, swelling or a burning smell. That's a stop sign — please don't open this at home.";
    result.status = "needs-pro";
    result.steps = blueprints.other.steps;
    result.tools = ["None — do not open"];
    result.timeEstimate = "Professional visit";
    result.difficulty = "Hard";
  }
  if (result.safety === "avoid") result.status = "needs-pro";

  return result;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const demoHistory: RepairResult[] = [
  {
    id: "rv_demo1",
    category: "kettle",
    ...blueprints.kettle,
    description: "Takes forever to boil and clicks off early.",
    createdAt: daysAgo(2),
    status: "fixed",
  },
  {
    id: "rv_demo2",
    category: "phone",
    ...blueprints.phone,
    description: "Cable only charges if I hold it at an angle.",
    createdAt: daysAgo(6),
    status: "fixed",
  },
  {
    id: "rv_demo3",
    category: "lamp",
    ...blueprints.lamp,
    description: "Flickers when I touch the switch.",
    createdAt: daysAgo(13),
    status: "in-progress",
  },
];

export const suggestedRepairs = [
  { category: "fan" as CategoryId, title: "Quiet a rattling fan", time: "25 min", safety: "caution" as SafetyLevel },
  { category: "blender" as CategoryId, title: "Replace a blender coupling", time: "10 min", safety: "safe" as SafetyLevel },
  { category: "laptop" as CategoryId, title: "Cool down a hot laptop", time: "30 min", safety: "caution" as SafetyLevel },
];
