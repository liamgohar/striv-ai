import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Crown,
  Compass,
  Layers3,
  CalendarDays,
  Rocket,
  Flame,
} from 'lucide-react';

const QUESTIONS = [
  {
    key: 'education',
    title: 'What is your highest level of education?',
    subtitle: 'This helps refine realistic paths and starting points.',
    multi: false,
    options: [
      { value: 'No formal education', desc: 'Self-taught or early stage.' },
      { value: 'High school', desc: 'Basic foundation, ready for practical paths.' },
      { value: 'Some college', desc: 'Partial specialization or direction.' },
      { value: 'College degree', desc: 'Structured knowledge and credentials.' },
      { value: 'Advanced degree', desc: 'Highly specialized or academic background.' },
    ],
  },
  {
    key: 'goal',
    title: 'What do you want first?',
    subtitle: 'Pick the immediate outcome, not the fantasy headline.',
    multi: false,
    options: [
      { value: 'Make money', desc: 'Fast path to proof and first income.' },
      { value: 'Learn a skill', desc: 'Build leverage before chasing scale.' },
      { value: 'Get a job', desc: 'Stability first, upside second.' },
      { value: 'Build a business', desc: 'Longer path, bigger upside.' },
    ],
  },
  {
    key: 'strengths',
    title: 'What already gives you an edge?',
    subtitle: 'Select every strength that is actually true.',
    multi: true,
    options: [
      { value: 'Communication', desc: 'You explain clearly and connect quickly.' },
      { value: 'Sales / persuasion', desc: 'You can make offers without freezing.' },
      { value: 'Creative / content', desc: 'You can create things people notice.' },
      { value: 'AI tools / basic tech', desc: 'You can use tools without deep code.' },
      { value: 'Discipline', desc: 'You can repeat boring work until it pays.' },
      { value: 'Hands-on / physical work', desc: 'You can handle real-world service work.' },
    ],
  },
  {
    key: 'constraints',
    title: 'Which constraints are real right now?',
    subtitle: 'Good strategy respects reality instead of pretending it does not exist.',
    multi: true,
    options: [
      { value: 'Almost no money', desc: 'You need low-cost or zero-cost paths.' },
      { value: 'Limited time', desc: 'You need high-leverage daily actions.' },
      { value: 'Little support', desc: 'You need structure and clarity quickly.' },
      { value: 'Not great with coding', desc: 'Avoid deep-tech traps.' },
      { value: 'Struggle with consistency', desc: 'You need stronger accountability.' },
      { value: 'No transportation', desc: 'Route-heavy local work gets harder.' },
    ],
  },
  {
    key: 'time',
    title: 'How much time can you realistically give this daily?',
    subtitle: 'Not your dream schedule. Your real one.',
    multi: false,
    options: [
      { value: '30–60 minutes', desc: 'Very constrained. Priorities must be sharp.' },
      { value: '1–2 hours', desc: 'Enough for real momentum.' },
      { value: '3–4 hours', desc: 'Enough to get serious fast.' },
      { value: '5+ hours', desc: 'You can move aggressively.' },
    ],
  },
  {
    key: 'work',
    title: 'What type of work feels most realistic for you?',
    subtitle: 'Pick what you would actually do, not what sounds cool.',
    multi: true,
    options: [
      { value: 'Local services', desc: 'Neighborhood jobs and repeat customers.' },
      { value: 'Online services', desc: 'Remote work and digital fulfillment.' },
      { value: 'Teaching / coaching', desc: 'Helping others improve.' },
      { value: 'Buying and selling', desc: 'Flipping, sourcing, arbitrage.' },
      { value: 'Automation / systems', desc: 'Replacing repetitive work with tools.' },
      { value: 'Content / audience', desc: 'Building attention and monetizing it.' },
    ],
  },
];

const PATH_LIBRARY = [
  {
    id: 'ugc',
    title: 'UGC Creator → Brand Content Deals',
    category: 'Online services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Creative / content', 'Communication'],
    work: ['Online services', 'Content / audience'],
    warning: [],
    why: 'Brands pay for content, not followers. Fast path to first income with proof loops.',
    earnings: '$50–$500 per piece early, scaling with volume and retainers.',
    actions: ['Pick 1 niche.', 'Create 3 sample videos on your phone.', 'DM 20 brands with your samples.', 'Offer 1 paid test.', 'Turn wins into a monthly package.'],
    scale: 'From one-off content to retainers to a mini agency.',
    finance: 'Reinvest into lighting, editing speed, and outreach volume.',
  },
  {
    id: 'shortform',
    title: 'Short-Form Agency (Reels/TikTok)',
    category: 'Online services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Creative / content', 'AI tools / basic tech'],
    work: ['Online services', 'Content / audience'],
    warning: [],
    why: 'Businesses need consistent content. Package outcomes, not edits.',
    earnings: '$300–$3,000+/mo per client.',
    actions: ['Choose one niche.', 'Create 2 sample edits.', 'Send 20 targeted offers.', 'Close 1 pilot client.', 'Convert to retainer.'],
    scale: 'Niche → retainers → team → systems.',
    finance: 'Reinvest into templates and faster delivery.',
  },
  {
    id: 'copy',
    title: 'Copywriting → Conversion Service',
    category: 'Online services',
    fit: ['Make money', 'Learn a skill'],
    strengths: ['Communication', 'Sales / persuasion'],
    work: ['Online services'],
    warning: [],
    why: 'Direct link to revenue; easier to sell with clear outcomes.',
    earnings: '$200–$2,000+/project early.',
    actions: ['Pick one format (emails/ads).', 'Rewrite 2 real examples.', 'Pitch 15 businesses.', 'Get 1 test project.', 'Track results.'],
    scale: 'From gigs → retainers → CRO/offer strategy.',
    finance: 'Reinvest into proof and case studies.',
  },
  {
    id: 'web',
    title: 'Simple Website Builds → Local Clients',
    category: 'Online services',
    fit: ['Make money', 'Build a business'],
    strengths: ['AI tools / basic tech', 'Communication'],
    work: ['Online services'],
    warning: [],
    why: 'Businesses need basic sites; no deep coding required.',
    earnings: '$200–$2,500 per site early.',
    actions: ['Pick a template tool.', 'Build 1 demo.', 'Pitch 20 local businesses.', 'Close 1 project.', 'Upsell maintenance.'],
    scale: 'From builds → retainers → niche agency.',
    finance: 'Reinvest into templates and lead lists.',
  },
  {
    id: 'rankrent',
    title: 'Rank & Rent → Local Lead Assets',
    category: 'Opportunity arbitrage',
    fit: ['Build a business'],
    strengths: ['AI tools / basic tech', 'Discipline'],
    work: ['Online services', 'Automation / systems'],
    warning: [],
    why: 'Own the lead asset and rent it; strong leverage when it works.',
    earnings: '$300–$3,000+/mo per site when ranked.',
    actions: ['Pick a niche + city.', 'Build 1 simple site.', 'Add basic SEO pages.', 'Get first calls/leads.', 'Sell to a local business.'],
    scale: 'Add sites → niches → systems.',
    finance: 'Reinvest into domains, content, and links.',
  },
  {
    id: 'cleaning',
    title: 'Home Cleaning → Recurring Clients',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Discipline'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'High repeat demand and easy to standardize.',
    earnings: '$80–$300/job early.',
    actions: ['Offer basic cleaning package.', 'Get 2 discounted jobs for proof.', 'Ask for weekly/biweekly plans.', 'Collect reviews.', 'Route jobs.'],
    scale: 'From solo → crews → contracts.',
    finance: 'Reinvest into supplies and scheduling.',
  },
  {
    id: 'window',
    title: 'Window Cleaning → Route Business',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'Simple, visible, repeatable service.',
    earnings: '$50–$300/job early.',
    actions: ['Pick one area.', 'Pitch 10 homes.', 'Do 1 job.', 'Upsell recurring.', 'Track routes.'],
    scale: 'Routes → crews → contracts.',
    finance: 'Reinvest into tools and route density.',
  },
  {
    id: 'lawn',
    title: 'Lawn Mowing → Route Business',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Discipline', 'Sales / persuasion'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'Simple offer, fast proof, recurring revenue, and real scale through route density, upsells, and crews.',
    earnings: '$100–$500/week early, then much higher with repeat customers and crews.',
    actions: ['Message or knock on 10 nearby homes with a simple mowing offer.', 'Use one clear price and one clear promise.', 'Take before-and-after photos from the first job.', 'Convert every one-off job into recurring service.', 'Track houses, payments, and follow-ups in one sheet.'],
    scale: 'Starts as a side hustle, becomes a route business, then grows with upsells, crews, and commercial contracts.',
    finance: 'Reinvest first into equipment reliability, route efficiency, and simple local marketing.',
  },
  {
    id: 'pressure',
    title: 'Pressure Washing → Exterior Services Brand',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Communication'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'Visual results sell themselves, referrals are strong, and upsells are built in.',
    earnings: '$150–$800/job depending on scope.',
    actions: ['Offer one visual service first: driveway or walkway cleaning.', 'Use before-and-after photos in outreach.', 'Bundle patios, fences, bins, or gutters.', 'Ask every customer for a referral.', 'Package recurring maintenance where possible.'],
    scale: 'Can expand into a broader exterior maintenance company with crews and recurring property clients.',
    finance: 'Use early cash for better equipment, water efficiency, and stronger service bundles.',
  },
  {
    id: 'detailing',
    title: 'Mobile Detailing → Membership Business',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Creative / content'],
    work: ['Local services', 'Content / audience'],
    warning: ['No transportation'],
    why: 'Visible transformation plus local repeat customers makes this strong and believable.',
    earnings: '$80–$400 per vehicle early.',
    actions: ['Create 3 simple service packages.', 'Get 2 discounted jobs for photos and reviews.', 'Offer maintenance plans instead of one-off cleans.', 'Post before-and-after proof locally.', 'Pitch offices or fleets for repeat work.'],
    scale: 'Grows through memberships, mobile crews, fleet contracts, and eventually premium detailing or fixed locations.',
    finance: 'Use early cash for better tools, cleaner presentation, and faster turnaround.',
  },
  {
    id: 'junk',
    title: 'Junk Removal → Local Ops Company',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Communication'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'Strong cash flow, obvious value, and good expansion into moving, cleanouts, and light demolition.',
    earnings: '$100–$1,000+ per job depending on volume.',
    actions: ['Write one simple junk removal offer.', 'Contact 10 local leads or property managers.', 'Photograph before-and-after results.', 'Ask for referrals from every customer.', 'Track disposal cost versus job price.'],
    scale: 'Can expand into crews, repeat property relationships, and adjacent local services.',
    finance: 'Reinvest into hauling efficiency, disposal workflow, and better lead flow.',
  },
  {
    id: 'moving',
    title: 'Moving Help → Local Service Crew',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Communication', 'Discipline'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'People already pay for help with painful physical problems. Great for referrals and repeat local demand.',
    earnings: '$100–$800 per day early depending on jobs and team size.',
    actions: ['Offer simple labor-only moving help first.', 'Post in local groups and neighborhoods.', 'Collect one testimonial after each job.', 'Track which job types are easiest and most profitable.', 'Package add-ons like packing or junk haul-off.'],
    scale: 'Can grow into full moving, labor crews, storage coordination, and local contracts.',
    finance: 'Use early income to improve reliability, scheduling, and basic equipment.',
  },
  {
    id: 'content',
    title: 'Content Service → Niche Agency',
    category: 'Online services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Creative / content', 'Communication', 'AI tools / basic tech'],
    work: ['Online services', 'Content / audience'],
    warning: [],
    why: 'Low startup cost, fast iteration, and strong leverage if you package business outcomes instead of random edits.',
    earnings: '$300–$2,000+/month per client early.',
    actions: ['Choose one niche and one deliverable: reels, ads, editing, or copy.', 'Create two niche-specific samples.', 'Send ten offers tied to one clear business outcome.', 'Use AI tools to reduce time without lowering quality.', 'Turn first wins into case studies and retainers.'],
    scale: 'Can become a specialist agency, then a productized service, then software or training.',
    finance: 'Reinvest in portfolio quality, faster delivery, and better lead generation.',
  },
  {
    id: 'automation',
    title: 'AI Automation Service',
    category: 'Automation / systems',
    fit: ['Make money', 'Learn a skill', 'Build a business'],
    strengths: ['AI tools / basic tech', 'Communication', 'Sales / persuasion'],
    work: ['Automation / systems', 'Online services'],
    warning: [],
    why: 'Good if you can learn tools quickly and sell time or money saved instead of selling buzzwords.',
    earnings: '$250–$3,000+ per setup or retainer early.',
    actions: ['Pick one repetitive workflow to solve: reminders, follow-up, or repurposing.', 'Build one rough demo with no-code tools.', 'Show it to five businesses.', 'Pitch saved time or saved money, not the tech.', 'Turn one winning workflow into a packaged offer.'],
    scale: 'Can evolve from custom setups into productized service and later a software layer.',
    finance: 'Spend early cash on better tool stack, templates, and niche-specific demos.',
  },
  {
    id: 'leadgen',
    title: 'Local Lead Generation → Client Pipeline Business',
    category: 'Opportunity arbitrage',
    fit: ['Make money', 'Build a business'],
    strengths: ['Communication', 'Sales / persuasion', 'AI tools / basic tech'],
    work: ['Online services', 'Automation / systems'],
    warning: [],
    why: 'You create lead flow for local businesses and get paid for results. Strong leverage once the system works.',
    earnings: '$500–$5,000+/month per niche or client when proven.',
    actions: ['Pick one local niche like roofing, med spas, or dentists.', 'Build one simple landing page or lead form.', 'Generate first traffic through outreach or simple ads.', 'Track which leads are real and which convert.', 'Pitch businesses using actual lead quality, not theory.'],
    scale: 'Scales by adding niches, automating traffic, improving conversion, and licensing the system.',
    finance: 'Reinvest into better lead quality, funnel optimization, and niche expansion.',
  },
  {
    id: 'setter',
    title: 'Appointment Setting → Sales Ops Path',
    category: 'Online services',
    fit: ['Make money', 'Learn a skill'],
    strengths: ['Sales / persuasion', 'Communication', 'Discipline'],
    work: ['Online services'],
    warning: [],
    why: 'Fast route for people who can handle repetition, improve messaging, and learn how offers really sell.',
    earnings: '$500–$3,000+/month early, more with commission or better clients.',
    actions: ['Pick one niche and one simple outreach angle.', 'Build a list of 30 prospects.', 'Send the first batch of messages today.', 'Track booked calls and reply rates.', 'Rewrite scripts based on objections.'],
    scale: 'Can grow into outbound systems, lead generation, and full sales development services.',
    finance: 'Use early cash for better lead data, script testing, and faster outreach tools.',
  },
  {
    id: 'reselling',
    title: 'Local Flipping → Resale System',
    category: 'Buying and selling',
    fit: ['Make money', 'Learn a skill'],
    strengths: ['Sales / persuasion', 'Discipline'],
    work: ['Buying and selling'],
    warning: [],
    why: 'Fast feedback, low barrier, and strong for learning pricing, negotiation, and cash discipline.',
    earnings: '$50–$500+ profit per flip depending on category.',
    actions: ['Choose one category only: tools, bikes, electronics, or furniture.', 'Study sold listings, not asking prices.', 'Source three underpriced items locally.', 'Relist with better photos and cleaner copy.', 'Track margin and time per flip.'],
    scale: 'Can become a sourcing and operations business with category focus and supplier relationships.',
    finance: 'Roll profits into higher-margin inventory and faster-turning categories.',
  },
  {
    id: 'newsletter',
    title: 'Niche Newsletter → Monetized Audience',
    category: 'Digital media',
    fit: ['Build a business', 'Learn a skill'],
    strengths: ['Creative / content', 'Communication', 'Discipline'],
    work: ['Content / audience', 'Online services'],
    warning: [],
    why: 'Audience businesses compound. Small consistent publishing can turn into sponsorships, affiliates, products, or services.',
    earnings: '$0 early, then sponsorship, affiliate, or product revenue as attention compounds.',
    actions: ['Choose one narrow niche people care about repeatedly.', 'Write your first 3 issue ideas.', 'Publish one clear useful edition.', 'Capture signups from communities or content.', 'Track which topics get the strongest response.'],
    scale: 'Can expand into sponsorships, premium content, affiliate revenue, products, and a larger media brand.',
    finance: 'Reinvest into better distribution, design, and higher-output publishing systems.',
  },
  {
    id: 'affiliate',
    title: 'Content + Affiliate Funnel',
    category: 'Digital business',
    fit: ['Make money', 'Build a business'],
    strengths: ['Creative / content', 'Discipline', 'Communication'],
    work: ['Content / audience', 'Online services'],
    warning: [],
    why: 'Works if you can build trust and direct attention toward high-intent offers.',
    earnings: '$0 early, then variable recurring or one-time commissions depending on offers.',
    actions: ['Choose one niche with obvious buyer intent.', 'Pick one product or offer worth promoting.', 'Publish content that solves a specific problem.', 'Insert clear calls to action.', 'Track clicks and conversions by topic.'],
    scale: 'Can grow into a content engine, media asset, or offer comparison brand.',
    finance: 'Reinvest into better content formats, testing, and traffic acquisition.',
  },
  {
    id: 'infoproduct',
    title: 'Expertise Packaging → Info Product',
    category: 'Digital product',
    fit: ['Build a business', 'Learn a skill'],
    strengths: ['Communication', 'Creative / content'],
    work: ['Teaching / coaching', 'Content / audience', 'Online services'],
    warning: [],
    why: 'Turning knowledge into a repeatable asset gives leverage beyond hourly work.',
    earnings: '$0 early, then scalable once an audience and offer exist.',
    actions: ['Choose one narrow problem you can explain clearly.', 'Outline the simplest version of the solution.', 'Validate interest with 5 conversations or pre-sales.', 'Build a lean first version, not a giant course.', 'Collect feedback and improve what people actually use.'],
    scale: 'Can expand into premium products, cohort programs, memberships, and brand authority.',
    finance: 'Reinvest into stronger proof, distribution, and customer success.',
  },
  {
    id: 'tutoring',
    title: 'Tutoring → Learning Brand',
    category: 'Teaching / coaching',
    fit: ['Make money', 'Learn a skill', 'Build a business'],
    strengths: ['Communication', 'Discipline'],
    work: ['Teaching / coaching', 'Online services'],
    warning: [],
    why: 'Low cost, trust-based, and ideal if you can explain things clearly and get people results.',
    earnings: '$20–$100+/hour early depending on subject and niche.',
    actions: ['Choose one subject and one student type.', 'Offer three trial sessions for proof and testimonials.', 'Turn common explanations into repeatable notes.', 'Group students by level to increase earnings per hour.', 'Build referrals through visible outcomes.'],
    scale: 'Can expand into groups, curriculum, digital products, and eventually a tutoring brand or team.',
    finance: 'Invest first into stronger materials, scheduling, and proof of outcomes.',
  },
  {
    id: 'coaching',
    title: 'Coaching Offer → Results-Based Program',
    category: 'Teaching / coaching',
    fit: ['Make money', 'Build a business'],
    strengths: ['Communication', 'Sales / persuasion'],
    work: ['Teaching / coaching', 'Online services'],
    warning: [],
    why: 'Works if you can get people real results and communicate a clear transformation.',
    earnings: '$100–$2,000+ per client depending on niche and proof.',
    actions: ['Define one narrow result you help people achieve.', 'Talk to 5 potential clients about their real pain points.', 'Package your process into a simple offer.', 'Get first proof through lower-friction pilot clients.', 'Turn testimonials into stronger positioning.'],
    scale: 'Can expand into premium coaching, groups, playbooks, and licensing your methodology.',
    finance: 'Reinvest into proof, process clarity, and lead generation.',
  },
  {
    id: 'event',
    title: 'Event Setup Help → Local Crew Business',
    category: 'Local services',
    fit: ['Make money', 'Build a business'],
    strengths: ['Hands-on / physical work', 'Discipline', 'Communication'],
    work: ['Local services'],
    warning: ['No transportation'],
    why: 'Events create urgent labor demand and strong word-of-mouth when you are reliable.',
    earnings: '$100–$600+ per event day early.',
    actions: ['Offer setup and breakdown help to local planners or venues.', 'Get one small event on the calendar first.', 'Photograph clean setups and organized execution.', 'Ask for referrals from planners and vendors.', 'Track profitable event types and timing.'],
    scale: 'Can grow into staffing, rentals, logistics coordination, and premium event support.',
    finance: 'Use early cash for reliability, presentation, and repeat relationships.',
  },
  {
    id: 'job',
    title: 'Targeted Job Sprint',
    category: 'Career path',
    fit: ['Get a job'],
    strengths: ['Communication', 'Discipline'],
    work: [],
    warning: [],
    why: 'Correct when stability matters more than pretending you need a startup right now.',
    earnings: 'Stable wages first, then skill and savings growth.',
    actions: ['Write a one-page resume or proof sheet.', 'Apply to five targeted roles, not random junk.', 'Message three hiring managers directly.', 'Prepare three short stories that prove work ethic.', 'Track every application and follow-up.'],
    scale: 'Creates breathing room, confidence, and cash flow so stronger paths become possible later.',
    finance: 'Use early income to build savings and fund the next skill or side hustle intelligently.',
  },
];

const RANGE_OPTIONS = ['1W', '1M', '6M', '1Y', 'ALL'];
const PLAN_OPTIONS = [
  { id: 'core-monthly', label: 'Core Monthly', price: '$9.99/mo', intro: '$4.99 first month', note: 'Best if you want flexibility while you test the system.' },
  { id: 'core-yearly', label: 'Core Yearly', price: '$79.99/yr', intro: 'Most committed users usually get stronger results', note: 'Yearly users are more likely to stay consistent long enough to see real income patterns and measurable progress.', highlight: true },
  { id: 'infinite-monthly', label: 'Infinite Monthly', price: '$19.99/mo', intro: '$9.99 first month', note: 'Track multiple businesses at once instead of one active path.' },
  { id: 'infinite-yearly', label: 'Infinite Yearly', price: '$139.99/yr', intro: 'Lowest cost for multi-path builders', note: 'Best for people serious enough to run several paths without resetting every few weeks.', highlight: true },
];

// ===== PROJECTIONS ENGINE =====
const calculateProjections = ({ incomeEntries = [], completedTasks = 0, totalTasks = 1, path, streak = 0 }) => {
  const totalIncome = incomeEntries.reduce((sum, v) => sum + v, 0);
  const days = Math.max(incomeEntries.length, 1);
  const avgDaily = totalIncome / days;
  const completionRate = completedTasks / Math.max(totalTasks, 1);

  let executionMultiplier = 1;
  if (completionRate > 0.8) executionMultiplier = 1.4;
  else if (completionRate > 0.6) executionMultiplier = 1.2;
  else if (completionRate < 0.3) executionMultiplier = 0.7;

  let streakMultiplier = 1;
  if (streak >= 14) streakMultiplier = 1.2;
  else if (streak >= 7) streakMultiplier = 1.12;
  else if (streak >= 3) streakMultiplier = 1.06;

  let scaleMultiplier = 1;
  if (!path) scaleMultiplier = 1;
  else if (path.category === 'Local services') scaleMultiplier = 1.1;
  else if (path.category === 'Online services') scaleMultiplier = 1.3;
  else if (path.category === 'Opportunity arbitrage') scaleMultiplier = 1.5;
  else if (path.category === 'Digital media' || path.category === 'Digital business' || path.category === 'Digital product') scaleMultiplier = 1.25;

  const base = avgDaily * executionMultiplier * streakMultiplier * scaleMultiplier;
  const confidence = incomeEntries.length >= 14 && completionRate >= 0.6 ? 'Medium' : incomeEntries.length >= 30 && completionRate >= 0.75 ? 'High' : 'Low';

  return {
    week: Math.round(base * 7),
    month: Math.round(base * 30),
    threeMonths: Math.round(base * 90),
    sixMonths: Math.round(base * 180),
    year: Math.round(base * 365),
    fiveYears: Math.round(base * 365 * 5),
    confidence,
  };
};

function scorePath(path, answers) {
  let score = 0;
  if (path.fit.includes(answers.goal)) score += 8;
  (answers.strengths || []).forEach((s) => { if (path.strengths.includes(s)) score += 2; });
  (answers.work || []).forEach((w) => { if (path.work.includes(w)) score += 2; });
  (answers.constraints || []).forEach((c) => {
    if (path.warning.includes(c)) score -= 4;
    if (c === 'Almost no money' && ['lawn', 'content', 'tutoring', 'automation', 'reselling', 'leadgen', 'newsletter', 'affiliate', 'setter', 'ugc', 'copy', 'web'].includes(path.id)) score += 1;
    if (c === 'Limited time' && ['reselling', 'content', 'job', 'newsletter', 'affiliate', 'setter', 'leadgen', 'ugc', 'copy'].includes(path.id)) score += 1;
    if (c === 'Not great with coding' && ['content', 'leadgen', 'newsletter', 'affiliate', 'coaching', 'tutoring', 'setter', 'ugc', 'copy'].includes(path.id)) score += 1;
    if (c === 'No transportation' && ['content', 'automation', 'leadgen', 'affiliate', 'newsletter', 'setter', 'tutoring', 'coaching', 'job', 'ugc', 'copy', 'web'].includes(path.id)) score += 1;
  });
  if ((answers.time === '3–4 hours' || answers.time === '5+ hours') && ['lawn', 'pressure', 'detailing', 'junk', 'moving', 'event', 'cleaning', 'window'].includes(path.id)) score += 1;
  if (answers.time === '30–60 minutes' && ['newsletter', 'affiliate', 'setter', 'job', 'content', 'ugc', 'copy'].includes(path.id)) score += 1;
  if (answers.education === 'Advanced degree' && ['coaching', 'tutoring', 'infoproduct'].includes(path.id)) score += 1;
  if (answers.education === 'College degree' && ['web', 'copy', 'job', 'coaching', 'tutoring'].includes(path.id)) score += 1;
  return score;
}

function getTaskPhases(path) {
  const fallback = {
    setup: ['Clarify the exact offer in one sentence.', 'Define what proof would count as a real first win.', 'Write down the smallest action that gets you closer to proof.'],
    outreach: ['Reach out to 5 potential customers or employers.', 'Track replies and objections in one place.', 'Improve your pitch using what people actually say back.'],
    proof: ['Get one small result you can point to as proof.', 'Write down what caused the result.', 'Ask for one testimonial, review, or measurable outcome.'],
    optimize: ['Improve the step that feels slowest or weakest.', 'Cut one part of the process that wastes time.', 'Standardize one thing you keep repeating.'],
    scale: ['Raise volume slightly without lowering quality.', 'Add one upsell, repeat channel, or leverage point.', 'Decide what to reinvest in based on what is already working.'],
  };
  const phaseMap = {
    lawn: { setup: ['Choose one neighborhood to target first.', 'Write a one-line mowing offer with one clear price.', 'Prepare a simple note or message you can send repeatedly.'], outreach: ['Contact 5 nearby homes today.', 'Post one local offer in a neighborhood group.', 'Track which message gets the best replies.'], proof: ['Complete one job and take before-and-after photos.', 'Ask one customer for recurring weekly or biweekly service.', 'Write down the exact objection you had to overcome.'], optimize: ['Map your route so travel time drops next week.', 'Refine your pricing based on actual time spent.', 'Create one upsell like edging or cleanup.'], scale: ['Pitch recurring service to every new customer.', 'Test a second neighborhood only after first traction.', 'Track repeat revenue versus one-time revenue.'] },
    pressure: { setup: ['Choose one visual service to sell first.', 'Create a simple before-and-after example image set.', 'Write one bundled offer with a clear outcome.'], outreach: ['Reach out to 5 local homeowners or storefronts.', 'Pitch your visual proof instead of generic promises.', 'Track what type of prospect responds best.'], proof: ['Complete one visible job and document it properly.', 'Ask what exterior issue bothered the client most.', 'Collect one testimonial or visual proof piece.'], optimize: ['Write a faster quote template for future leads.', 'Test one upsell like bins, gutters, or patio cleaning.', 'Refine your offer based on objections.'], scale: ['Package recurring maintenance where possible.', 'Target the best-performing neighborhood again.', 'Track average job value and raise it through bundles.'] },
    detailing: { setup: ['Create 3 simple service packages.', 'Write down what makes each package worth the price.', 'Set up the fastest mobile workflow you can manage.'], outreach: ['Offer discounted first jobs for proof and reviews.', 'Post one local proof-based offer.', 'Message 5 potential customers today.'], proof: ['Complete one detail and take strong before-and-after photos.', 'Ask the customer what result mattered most to them.', 'Collect one written review.'], optimize: ['Improve your package descriptions using customer language.', 'Reduce time spent on your slowest service step.', 'Create one repeatable checklist for each package.'], scale: ['Offer one maintenance plan or monthly package.', 'Pitch one office, fleet, or repeat-use customer.', 'Track which package gives best margin and repeat demand.'] },
    junk: { setup: ['Write one simple junk removal offer.', 'Clarify what jobs you will and will not take at first.', 'Create a simple pricing rule for small jobs.'], outreach: ['Contact 10 local leads or property managers.', 'Post a local cleanout or haul-off offer.', 'Track which lead sources reply.'], proof: ['Complete one job and photograph before-and-after results.', 'Ask for one referral from the client.', 'Track disposal cost versus job price.'], optimize: ['Refine pricing based on actual disposal and labor time.', 'Write a faster quote script.', 'Identify the most profitable job type so far.'], scale: ['Pitch repeat work to landlords or property managers.', 'Bundle one adjacent service like cleanout or moving help.', 'Track repeat inquiries by source.'] },
    moving: { setup: ['Offer simple labor-only moving help first.', 'Define the exact type of move you want to take.', 'Write one short pitch for local groups.'], outreach: ['Post in local groups and neighborhoods.', 'Message 5 potential customers or local contacts.', 'Track which offers get interest.'], proof: ['Complete one job and note what slowed you down.', 'Ask for one testimonial after the move.', 'Record what add-on the client would have paid for.'], optimize: ['Refine your pricing based on labor intensity.', 'Build a checklist so jobs run smoother.', 'Cut one step that wastes time or causes stress.'], scale: ['Package one add-on like packing or junk haul-off.', 'Reach out to someone who can feed repeat work.', 'Track profitable job types and focus on them.'] },
    content: { setup: ['Choose one niche and one deliverable to focus on.', 'Create one niche-specific sample asset.', 'Write an offer tied to one business outcome.'], outreach: ['Send 10 direct offers today.', 'Track reply rates and objections from outreach.', 'Refine your outreach using what actually gets replies.'], proof: ['Turn one sample or client result into a mini case study.', 'Post one proof-based piece of content.', 'Collect one measurable result or testimonial.'], optimize: ['Improve your offer headline based on responses.', 'Reduce delivery time with better systems or AI tools.', 'Package your service into one clear monthly offer.'], scale: ['Pitch retainers instead of one-off edits.', 'Focus only on the niche responding best.', 'Turn repeated delivery into a process, not improvisation.'] },
    automation: { setup: ['Choose one repetitive workflow to solve this week.', 'Sketch the workflow in simple steps.', 'Define the outcome in time saved or money saved.'], outreach: ['Show the idea to 3 businesses or prospects.', 'Write your pitch around saved time or saved money.', 'Track what part of the pitch gets confusion.'], proof: ['Build one small no-code demo and show it.', 'Get one real reaction from a target user.', 'Document what part felt most valuable to them.'], optimize: ['Turn the workflow into a repeatable offer.', 'Create one template that speeds up delivery.', 'Cut unnecessary steps from setup.'], scale: ['Focus on one niche where the pain is most obvious.', 'Identify the next most valuable automation add-on.', 'Reinvest into demos or assets that close faster.'] },
    leadgen: { setup: ['Pick one local niche to target first.', 'Build one simple lead capture page or form.', 'Define what counts as a qualified lead.'], outreach: ['Generate first traffic through outreach or simple ads.', 'Message 5 businesses in the niche.', 'Track who actually responds to lead talk.'], proof: ['Capture first leads and check if they are real.', 'Ask one business what a lead is worth to them.', 'Document conversion quality, not just lead count.'], optimize: ['Improve weak spots in the form or funnel.', 'Cut traffic sources that bring junk leads.', 'Refine the niche if demand is weak.'], scale: ['Pitch using actual lead quality instead of theory.', 'Double down on the best-performing traffic source.', 'Explore adding one adjacent niche only after proof.'] },
    setter: { setup: ['Pick one niche and one outreach angle.', 'Write a short script that sounds human.', 'Define what counts as a qualified booked call.'], outreach: ['Build a list of 30 prospects.', 'Send the first batch of messages today.', 'Track booked calls and reply rates.'], proof: ['Get one real booked conversation.', 'Write down the objection that almost killed it.', 'Refine your script based on actual resistance.'], optimize: ['Improve one weak part of your outreach flow.', 'Shorten the script where people drop off.', 'Focus on the niche with the best response rate.'], scale: ['Increase daily outreach volume slightly.', 'Test a second messaging angle.', 'Systemize follow-up so leads do not disappear.'] },
    reselling: { setup: ['Pick one category only for now.', 'Define your minimum acceptable profit.', 'Review sold listings, not asking prices.'], outreach: ['Source 3 underpriced items locally.', 'Message sellers and negotiate better prices.', 'Track which sourcing channel finds best deals.'], proof: ['Relist with stronger photos and cleaner titles.', 'Sell one item and record exact margin.', 'Write down what made the item move faster.'], optimize: ['Improve photography or listing quality.', 'Cut slow-moving categories faster.', 'Refine what good inventory means for you.'], scale: ['Reinvest only in faster-turning stock.', 'Increase sourcing volume in the winning category.', 'Track margin and time to sale together.'] },
    newsletter: { setup: ['Choose one niche with repeat interest.', 'Write your first 3 issue ideas.', 'Define the type of reader you want.'], outreach: ['Publish one clear useful edition.', 'Share it in one relevant community.', 'Track what topics get signups or replies.'], proof: ['Capture first subscribers and note why they joined.', 'Ask one reader what they want more of.', 'Document your best-performing topic.'], optimize: ['Tighten the angle of the newsletter.', 'Remove topics readers clearly do not care about.', 'Improve the signup or intro copy.'], scale: ['Publish consistently instead of randomly.', 'Test one simple monetization path.', 'Double down on the content that actually grows the list.'] },
    affiliate: { setup: ['Choose one niche with clear buyer intent.', 'Pick one product or offer worth promoting.', 'Define the problem your content will solve.'], outreach: ['Publish one piece of content tied to a buyer problem.', 'Distribute it in one place your audience already exists.', 'Track clicks instead of vanity engagement.'], proof: ['Get your first clicks or conversions.', 'Write down which topic created the action.', 'Ask whether the offer truly matches the audience.'], optimize: ['Improve weak calls to action.', 'Replace content that gets views but no intent.', 'Focus on the content angle that produces clicks.'], scale: ['Create more content around winning buyer intent.', 'Test one better or higher-value offer.', 'Track which traffic source brings best conversion quality.'] },
    infoproduct: { setup: ['Choose one narrow problem you can solve clearly.', 'Outline the simplest useful version of the solution.', 'Define who the product is really for.'], outreach: ['Talk to 5 potential buyers about the real pain point.', 'Validate interest with simple pre-sell language.', 'Track where people get confused.'], proof: ['Get first proof of interest, feedback, or pre-sale.', 'Build the smallest version that solves the problem.', 'Document what users actually care about most.'], optimize: ['Cut content users do not need.', 'Improve the explanation of the result, not the process.', 'Refine based on real feedback instead of guesses.'], scale: ['Add stronger proof to the offer.', 'Build a repeatable acquisition path.', 'Reinvest in the channel that brings the best buyers.'] },
    tutoring: { setup: ['Pick one subject and one student type to serve.', 'Design one short diagnostic or trial session.', 'Clarify the result students actually want.'], outreach: ['Offer 3 trial sessions or outreach messages.', 'Track where students or parents show interest.', 'Refine your intro based on questions they ask.'], proof: ['Run one session and note what worked best.', 'Collect one testimonial or parent feedback quote.', 'Write down the 3 questions students struggle with most.'], optimize: ['Turn one explanation into reusable teaching notes.', 'Group learners by level for better efficiency.', 'Improve session structure to create clearer wins.'], scale: ['Raise clarity before raising price.', 'Design one repeatable mini-lesson or offer.', 'Build referral momentum from visible outcomes.'] },
    coaching: { setup: ['Define one narrow result you help people achieve.', 'Write down the clearest version of your process.', 'Decide who this is definitely not for.'], outreach: ['Talk to 5 potential clients about their real pain.', 'Pitch a simple pilot offer, not a massive program.', 'Track the objections that come up repeatedly.'], proof: ['Get one pilot client or deep feedback conversation.', 'Document one small transformation or win.', 'Turn that win into sharper offer language.'], optimize: ['Package the process into clearer steps.', 'Remove vague promises from your messaging.', 'Improve client onboarding or delivery quality.'], scale: ['Raise price only after better proof exists.', 'Explore group delivery if outcomes are consistent.', 'Reinvest in lead flow that brings the right clients.'] },
    event: { setup: ['Define what type of events you want to support first.', 'Write a simple setup and breakdown offer.', 'Clarify what makes you reliable and useful.'], outreach: ['Reach out to local planners, venues, or vendors.', 'Pitch your help for one small event first.', 'Track which contacts actually respond.'], proof: ['Complete one event and note what caused friction.', 'Take photos of clean setup or organized execution.', 'Ask for one referral or testimonial.'], optimize: ['Improve your event checklist based on mistakes.', 'Track which event type is easiest and most profitable.', 'Clarify your pricing based on real effort.'], scale: ['Pitch repeat support to the most valuable contact.', 'Bundle one adjacent service or crew offer.', 'Build repeat relationships instead of random gigs.'] },
    job: { setup: ['Choose 5 targeted roles worth applying to.', 'Improve one section of your resume or proof sheet.', 'Clarify what type of role is the real target.'], outreach: ['Send 3 direct applications with tailored language.', 'Message one hiring manager directly.', 'Track which job titles are getting the best response.'], proof: ['Get one callback, interview, or real response.', 'Prepare one short story that proves reliability.', 'Write down what question made you hesitate.'], optimize: ['Tighten your pitch around outcomes, not duties.', 'Refine your resume using what is getting responses.', 'Ask one person for feedback on your application materials.'], scale: ['Follow up on older applications instead of only starting new ones.', 'Increase application quality, not just quantity.', 'Use early income to stabilize and fund the next skill path.'] },
  };
  return phaseMap[path.id] || fallback;
}

function getTodayKey() { return new Date().toDateString(); }
function calculateStreak(history) { let streak = 0; const d = new Date(); while (history[d.toDateString()]) { streak += 1; d.setDate(d.getDate() - 1); } return streak; }
function getLevel(totalIncome) { if (totalIncome >= 2000) return 'Scaler'; if (totalIncome >= 500) return 'Builder'; if (totalIncome >= 100) return 'Operator'; return 'Beginner'; }
function getExecutionState(totalIncome, streak, completedCount) { if (totalIncome >= 500 || completedCount >= 45) return 'scale'; if (totalIncome >= 100 || completedCount >= 20) return 'repeat'; if (totalIncome > 0 || completedCount >= 8) return 'proof'; if (streak >= 3 || completedCount >= 3) return 'outreach'; return 'setup'; }
function getStateSpecificTasks(path, state) { const generic = { setup: 'Define the smallest real-world action that could create proof today.', outreach: 'Do one block of focused outreach and track what response it gets.', proof: 'Turn one response, result, or conversation into proof you can reuse.', repeat: 'Repeat only the behavior that produced real traction.', scale: 'Increase volume, improve pricing, or systemize the winning step.' }; const map = { lawn: { setup: 'Write the exact text you will send to 5 nearby homes today.', outreach: 'Knock on or message 5 more homes using the same offer and track replies.', proof: 'Turn your first happy customer into a testimonial and recurring-service pitch.', repeat: 'Repeat the best-performing outreach route instead of trying a new area.', scale: 'Raise route density by focusing only on the streets with the highest reply rate.' }, leadgen: { setup: 'Choose one niche and define what counts as a qualified lead in one sentence.', outreach: 'Message 5 businesses with a direct line about lead quality, not vague marketing.', proof: 'Validate your first leads by asking one business what they would actually pay for.', repeat: 'Double down on the traffic source producing the cleanest leads, not the most leads.', scale: 'Pitch one additional business using actual lead data and close-proof language.' }, content: { setup: 'Write one offer around a business result, not around editing or posting.', outreach: 'Send 10 direct offers and track which first line gets replies.', proof: 'Turn one sample or result into a case study with a measurable outcome.', repeat: 'Repeat outreach only in the niche that replied best this week.', scale: 'Package your best-performing service into a retainer instead of one-off work.' }, setter: { setup: 'Write a short script that sounds human and gets to the point in under 2 lines.', outreach: 'Send one clean batch of outreach and record reply rate before changing the script.', proof: 'Turn the first booked conversation into a better script, not just a lucky win.', repeat: 'Repeat the highest-reply angle until performance drops.', scale: 'Increase outreach volume slightly while protecting response quality.' } }; return (map[path?.id] || generic)[state] || generic[state]; }
function mergeDoneState(oldDays, newDays) { const doneMap = new Map(); (oldDays || []).forEach((day) => day.tasks.forEach((task) => doneMap.set(`${day.date}__${task.text}`, task.done))); return newDays.map((day) => ({ ...day, tasks: day.tasks.map((task) => ({ ...task, done: doneMap.get(`${day.date}__${task.text}`) || false })) })); }
function buildTasks(path, userState = { totalIncome: 0, streak: 0, completedCount: 0 }) { const phases = getTaskPhases(path); const totalDays = 365; const today = new Date(); const executionState = getExecutionState(userState.totalIncome, userState.streak, userState.completedCount); const adaptiveTask = getStateSpecificTasks(path, executionState); const getPhaseByDay = (dayIndex) => { if (dayIndex < 7) return 'setup'; if (dayIndex < 30) return 'outreach'; if (dayIndex < 60) return 'proof'; if (dayIndex < 120) return 'optimize'; return 'scale'; }; return Array.from({ length: totalDays }).map((_, dayIndex) => { const date = new Date(today); date.setDate(today.getDate() + dayIndex); const phase = getPhaseByDay(dayIndex); const phaseTasks = phases[phase] || phases.setup; const baseTasks = Array.from({ length: 3 }).map((__, idx) => ({ id: `${path.id}-${phase}-${dayIndex}-${idx}`, text: phaseTasks[(dayIndex + idx * 2) % phaseTasks.length], done: false })); const tasks = [...baseTasks, { id: `${path.id}-${phase}-${dayIndex}-adaptive`, text: adaptiveTask, done: false }]; const milestoneMap = { 6: 'Review your first week. What actually worked? Double down on that.', 29: 'You are 30 days in. Identify your best income-producing action and repeat it.', 89: '90 days in. Raise your pricing or increase volume based on proof.', 179: '6 months in. Systemize what works so it no longer depends fully on you.' }; if (milestoneMap[dayIndex]) tasks.push({ id: `${path.id}-milestone-${dayIndex}`, text: milestoneMap[dayIndex], done: false }); return { date: date.toDateString(), phase, tasks }; }); }
function generateIncomeMessage(amount, totalAfterLog) { const pool = [`You just logged $${amount}. That’s proof. Double down on what caused it.`, `$${amount} came from execution, not ideas. Repeat the exact behavior.`, `This $${amount} matters. Consistency now beats trying something new.`, `Good. You’re turning effort into money. Track what worked and do it again.`]; if (totalAfterLog >= 1000) return `You’ve crossed $${totalAfterLog}. Now you scale: increase volume, raise price, or improve delivery.`; if (totalAfterLog >= 500) return `You’re at $${totalAfterLog}. This is real. Reinforce systems that create repeat income.`; if (totalAfterLog >= 100) return `You hit $${totalAfterLog}. You’ve proven this works. Now repeat and stabilize.`; return pool[Math.floor(Math.random() * pool.length)]; }
function incomeAdvice(total, path) { if (!path) return 'Pick a path first. Then the money guidance becomes specific.'; if (total >= 1000) return `You have made $${total}. That is proof, not luck. Increase capacity or raise pricing inside ${path.title.toLowerCase()}.`; if (total >= 500) return `You have real momentum. Reinvest a portion into speed, quality, or outreach for ${path.title.toLowerCase()}.`; if (total >= 100) return 'You have validated the first dollars. Protect the cash, study what worked, and repeat it.'; if (total > 0) return 'First income matters because it proves this is real. Focus on consistency now.'; return 'No income logged yet. Today is about action, not fantasy.'; }
function mentorReply(input, path, totalIncome, selectedDay, savedPaths, rankedPaths) { const q = input.trim().toLowerCase(); if (!q) return 'Ask something specific: next step, pricing, scaling, or income.'; if (!path) return 'Pick a path first. Then I can guide you properly.'; const nextTask = selectedDay?.tasks?.find((t) => !t.done)?.text || path.actions?.[0]; if (q.includes('why')) return path.why; if (q.includes('scale')) return path.scale; if (q.includes('next')) return nextTask ? `Do this next: ${nextTask}` : 'You finished today. Prepare tomorrow.'; if (q.includes('today')) return nextTask ? `Focus on this first: ${nextTask}` : 'You already completed today. Look ahead.'; if (q.includes('money') || q.includes('reinvest')) return incomeAdvice(totalIncome, path); if (q.includes('price')) return 'Start low enough to close fast. Raise price once demand and proof exist.'; if (q.includes('stuck')) return `You’re overthinking. Go back to the smallest action that produces proof in ${path.title}.`; if (q.includes('switch')) return 'Switch only if you have zero proof after real effort. Otherwise you are just escaping difficulty.'; if (q.includes('progress')) return `You have ${savedPaths.length} active path${savedPaths.length === 1 ? '' : 's'}. Progress comes from sticking with one long enough.`; if (q.includes('other')) return `Top alternatives: ${rankedPaths.slice(0, 3).map((p) => p.title).join(', ')}.`; return `Stop thinking, execute. Next: ${nextTask || 'take the smallest action that creates proof.'}`; }
function progressPercent(tasks) { if (!tasks || tasks.length === 0) return 0; return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100); }
function filterIncomeRange(log, range, firstUseDate) { if (range === 'ALL') return log.filter((item) => new Date(item.rawDate) >= new Date(firstUseDate)); const days = range === '1W' ? 7 : range === '1M' ? 31 : range === '6M' ? 183 : 366; return log.filter((item) => ((Date.now() - new Date(item.rawDate).getTime()) / (1000 * 60 * 60 * 24)) <= days); }
function formatXAxis(dateString, range) { const date = new Date(dateString); if (range === '1W') return date.toLocaleDateString(undefined, { weekday: 'short' }); if (range === '1M') return String(date.getDate()); if (range === '6M') return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); if (range === '1Y') return date.toLocaleDateString(undefined, { month: 'short' }); return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }); }
function getXAxisLabel(range) { if (range === '1W') return 'Bottom axis: days this week'; if (range === '1M') return 'Bottom axis: days this month'; if (range === '6M') return 'Bottom axis: dates across 6 months'; if (range === '1Y') return 'Bottom axis: months this year'; return 'Bottom axis: timeline since first use'; }
function getYAxisLabel() { return 'Left axis: income ($)'; }

export default function App() {
  const [screen, setScreen] = useState('home');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ strengths: [], constraints: [], work: [] });
  const [activePath, setActivePath] = useState(null);
  const [savedPaths, setSavedPaths] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomeLog, setIncomeLog] = useState([]);
  const [incomeInput, setIncomeInput] = useState('');
  const [feedback, setFeedback] = useState('Build clarity first. Then execute hard enough to learn.');
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([{ role: 'assistant', text: 'I explain why a path fits, what to do next, and how to use your money intelligently. Ask directly.' }]);
  const [incomeRange, setIncomeRange] = useState('1M');
  const [selectedPlan, setSelectedPlan] = useState('core-yearly');
  const [firstUseDate] = useState(new Date().toISOString());
  const [taskHistory, setTaskHistory] = useState({});

  const currentQuestion = QUESTIONS[step];
  const rankedPaths = useMemo(() => [...PATH_LIBRARY].map((p) => ({ ...p, score: scorePath(p, answers) })).sort((a, b) => b.score - a.score).slice(0, 5), [answers]);
  const totalIncome = useMemo(() => incomeLog.reduce((sum, item) => sum + item.amount, 0), [incomeLog]);
  const streak = useMemo(() => calculateStreak(taskHistory), [taskHistory]);
  const level = useMemo(() => getLevel(totalIncome), [totalIncome]);
  const currentTaskSet = activePath ? calendarTasks[activePath.id] || [] : [];
  const selectedDay = useMemo(() => currentTaskSet.find((d) => d.date === selectedDate.toDateString()) || currentTaskSet[0] || null, [currentTaskSet, selectedDate]);
  const completedTaskCount = useMemo(() => activePath ? (calendarTasks[activePath.id] || []).flatMap((d) => d.tasks).filter((t) => t.done).length : 0, [activePath, calendarTasks]);
  const totalTaskCount = useMemo(() => activePath ? (calendarTasks[activePath.id] || []).flatMap((d) => d.tasks).length : 1, [activePath, calendarTasks]);
  const dayProgress = useMemo(() => progressPercent(selectedDay?.tasks || []), [selectedDay]);
  const filteredIncome = useMemo(() => filterIncomeRange(incomeLog, incomeRange, firstUseDate), [incomeLog, incomeRange, firstUseDate]);
  const chartData = useMemo(() => filteredIncome.map((item) => ({ label: formatXAxis(item.rawDate, incomeRange), income: item.amount, fullDate: new Date(item.rawDate).toLocaleDateString() })), [filteredIncome, incomeRange]);
  const canProceed = currentQuestion?.multi ? (answers[currentQuestion.key] || []).length > 0 : Boolean(answers[currentQuestion?.key]);
  const selectedPlanData = PLAN_OPTIONS.find((p) => p.id === selectedPlan);
  const projections = useMemo(() => calculateProjections({ incomeEntries: incomeLog.slice(-30).map((item) => item.amount), completedTasks: completedTaskCount, totalTasks: totalTaskCount, path: activePath, streak }), [incomeLog, completedTaskCount, totalTaskCount, activePath, streak]);

  function toggleAnswer(key, value, multi) {
    if (multi) {
      const current = answers[key] || [];
      setAnswers((prev) => ({ ...prev, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] }));
    } else {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    }
  }

  function nextStep() {
    if (step < QUESTIONS.length - 1) setStep((prev) => prev + 1);
    else {
      setScreen('results');
      setFeedback('Good. Pick the path that matches your reality, not your ego.');
    }
  }

  function backStep() {
    if (step > 0) setStep((prev) => prev - 1);
    else setScreen('home');
  }

  function choosePath(path) {
    if (!path) return;
    const exists = savedPaths.some((p) => p.id === path.id);
    if (!exists) {
      setSavedPaths((prev) => [...prev, path]);
      setCalendarTasks((prev) => ({ ...prev, [path.id]: buildTasks(path, { totalIncome, streak, completedCount: 0 }) }));
    }
    setActivePath(path);
    setSelectedDate(new Date());
    setScreen('dashboard');
    setFeedback(`You chose ${path.title}. Good. Stop browsing and start executing.`);
  }

  function retakeQuestions() {
    setStep(0);
    setScreen('onboarding');
    setFeedback('Retake the questions only if your reality changed. Not because you got distracted.');
  }

  function browseMore() {
    setScreen('results');
    setFeedback('Compare carefully. Pick the path you are actually willing to execute.');
  }

  function toggleTask(date, taskId) {
    if (!activePath) return;
    setCalendarTasks((prev) => ({
      ...prev,
      [activePath.id]: (prev[activePath.id] || []).map((day) => {
        if (day.date !== date) return day;
        return {
          ...day,
          tasks: day.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task),
        };
      }),
    }));
    setTaskHistory((prev) => ({ ...prev, [getTodayKey()]: true }));
    setFeedback('Good. Small completed actions beat big intentions. Now do the next one.');
  }

  function addIncome() {
    const amount = Number(incomeInput);
    if (!amount || amount <= 0) return;
    const nextTotal = totalIncome + amount;
    setIncomeLog((prev) => [...prev, { date: new Date().toLocaleDateString(), rawDate: new Date().toISOString(), amount }]);
    setIncomeInput('');
    setFeedback(generateIncomeMessage(amount, nextTotal));
  }

  function sendChat() {
    const userText = chatInput.trim();
    if (!userText) return;
    const reply = mentorReply(userText, activePath, totalIncome, selectedDay, savedPaths, rankedPaths);
    setChat((prev) => [...prev, { role: 'user', text: userText }, { role: 'assistant', text: reply }]);
    setChatInput('');
  }

  useEffect(() => {
    if (!activePath) return;
    setCalendarTasks((prev) => {
      const existing = prev[activePath.id] || [];
      const rebuilt = buildTasks(activePath, { totalIncome, streak, completedCount: completedTaskCount });
      return { ...prev, [activePath.id]: mergeDoneState(existing, rebuilt) };
    });
  }, [activePath, totalIncome, streak, completedTaskCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl grid gap-6">
        {screen === 'home' && (
          <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <CardHeader className="p-8 md:p-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-400/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-300 via-white to-emerald-300 text-slate-950 flex items-center justify-center shadow-lg">
                    <Rocket className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black tracking-[0.22em] text-white">STRIV AI</div>
                    <div className="text-xs uppercase tracking-[0.38em] text-slate-300">Direction • Execution • Income</div>
                  </div>
                </div>
                <Badge className="w-fit bg-sky-500/20 text-sky-100 border-sky-400/30">Start your future with clarity</Badge>
                <CardTitle className="text-4xl md:text-6xl leading-tight mt-4 text-white max-w-4xl">Stop drifting. Build a path that actually fits you.</CardTitle>
                <CardDescription className="text-slate-200 text-lg max-w-2xl pt-3 leading-8">Striv AI helps you choose the right path, execute daily, track your income, and make smarter decisions with every step forward.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 md:px-10 pb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-200 text-sm"><Sparkles className="w-4 h-4 text-sky-300" /> Premium clarity · Smarter mentor · Better progress tracking · Mobile friendly</div>
              <Button className="rounded-2xl px-8 bg-sky-400 text-slate-950 hover:bg-sky-300" onClick={() => setScreen('onboarding')}>Start Your Path <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </CardContent>
          </Card>
        )}

        {screen === 'onboarding' && (
          <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardDescription className="text-slate-300">Build your plan · Question {step + 1} of {QUESTIONS.length}</CardDescription>
              <Progress value={((step + 1) / QUESTIONS.length) * 100} className="h-2 mt-2" />
              <CardTitle className="text-3xl text-white pt-4">{currentQuestion.title}</CardTitle>
              <CardDescription className="text-base text-slate-300">{currentQuestion.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => {
                  const selected = currentQuestion.multi ? (answers[currentQuestion.key] || []).includes(opt.value) : answers[currentQuestion.key] === opt.value;
                  return (
                    <button key={opt.value} type="button" onClick={() => toggleAnswer(currentQuestion.key, opt.value, currentQuestion.multi)} className={`text-left rounded-2xl p-4 border transition ${selected ? 'border-sky-400 bg-sky-500/15' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                      <div className="font-semibold text-lg text-white">{opt.value}</div>
                      <div className="text-sm text-slate-300 mt-1">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between gap-3 mt-6 flex-wrap">
                <Button variant="outline" className="rounded-2xl border-slate-600 text-white bg-transparent hover:bg-slate-800" onClick={backStep}><ArrowLeft className="mr-2 w-4 h-4" /> Back</Button>
                <Button className="rounded-2xl bg-sky-400 text-slate-950 hover:bg-sky-300" disabled={!canProceed} onClick={nextStep}>{step === QUESTIONS.length - 1 ? 'See what fits' : 'Next'} <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {screen === 'results' && (
          <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardDescription className="text-slate-300">See what fits you</CardDescription>
              <CardTitle className="text-3xl text-white">Top paths for your situation</CardTitle>
              <CardDescription className="text-slate-300">These should feel specific and real, not generic. Pick the path that matches your reality, not your pride.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {rankedPaths.map((path, idx) => (
                <div key={path.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-300">Fit rank #{idx + 1}</div>
                      <div className="text-2xl font-semibold mt-1 text-white">{path.title}</div>
                      <p className="text-slate-200 mt-2 leading-7">{path.why}</p>
                      <div className="text-sm text-slate-200 mt-3"><span className="font-medium text-white">Earning potential:</span> {path.earnings}</div>
                      <div className="text-sm text-slate-200 mt-1"><span className="font-medium text-white">Scale path:</span> {path.scale}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300" onClick={() => choosePath(path)}>Choose path</Button>
                      <Button variant="outline" className="rounded-2xl border-slate-600 text-white bg-transparent hover:bg-slate-900" onClick={browseMore}>Learn more</Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {path.actions.slice(0, 3).map((action) => (
                      <div key={action} className="text-sm text-slate-100 flex items-start gap-2 leading-6"><Target className="w-4 h-4 mt-1 text-sky-300" />{action}</div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="rounded-2xl border-slate-600 text-white bg-transparent hover:bg-slate-800 w-fit" onClick={retakeQuestions}>Retake questions</Button>
            </CardContent>
          </Card>
        )}

        {screen === 'dashboard' && activePath && (
          <div className="grid xl:grid-cols-[1.55fr_.95fr] gap-6">
            <div className="grid gap-6">
              <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardDescription className="text-slate-300">Execution mode</CardDescription>
                      <CardTitle className="text-3xl text-white">{activePath.title}</CardTitle>
                      <CardDescription className="text-slate-300">{activePath.why}</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                      <Badge className="bg-slate-800 text-white border-slate-600">Level: {level}</Badge>
                      <Badge className="bg-orange-500/15 text-orange-100 border-orange-400/30"><Flame className="w-3 h-3 mr-1" /> {streak} day streak</Badge>
                      <Button variant="outline" className="rounded-2xl border-slate-600 text-white bg-transparent hover:bg-slate-800" onClick={browseMore}><Compass className="w-4 h-4 mr-2" /> Learn more</Button>
                      <Button variant="outline" className="rounded-2xl border-slate-600 text-white bg-transparent hover:bg-slate-800" onClick={retakeQuestions}>Retake questions</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tasks" className="w-full">
                    <TabsList className="bg-slate-800 border border-slate-700 rounded-2xl flex-wrap h-auto">
                      <TabsTrigger value="tasks">Daily plan</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="progress">Progress</TabsTrigger>
                      <TabsTrigger value="projections">Projections</TabsTrigger>
                      <TabsTrigger value="paywall">Membership</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tasks" className="mt-6">
                      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                        <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                          <CardContent className="p-4">
                            <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} className="rounded-xl mx-auto text-white" />
                            <p className="text-sm text-slate-300 mt-4">Look ahead. Different days now carry different actions based on the business you chose.</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div>
                                <div className="text-sm text-slate-300">{selectedDate.toDateString()}</div>
                                <div className="text-xs uppercase tracking-wider text-sky-300 mt-1">{selectedDay?.phase || 'phase'}</div>
                                <div className="text-xl font-semibold mt-1 text-white">Daily execution</div>
                              </div>
                              <div className="relative w-24 h-24 shrink-0">
                                <svg viewBox="0 0 120 120" className="w-24 h-24 -rotate-90">
                                  <circle cx="60" cy="60" r="48" stroke="#334155" strokeWidth="12" fill="none" />
                                  <circle cx="60" cy="60" r="48" stroke="#22c55e" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={302} strokeDashoffset={302 - (302 * dayProgress) / 100} />
                                </svg>
                                <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-white">{dayProgress}%</div>
                              </div>
                            </div>
                            <div className="mt-5 grid gap-3">
                              {(selectedDay?.tasks || []).map((task) => (
                                <label key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-700 p-3 bg-slate-900 cursor-pointer">
                                  <Checkbox checked={task.done} onCheckedChange={() => selectedDay && toggleTask(selectedDay.date, task.id)} className="mt-1" />
                                  <span className="text-sm leading-6 text-white">{task.text}</span>
                                </label>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="income" className="mt-6">
                      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                        <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                          <CardContent className="p-5 grid gap-4">
                            <div>
                              <div className="text-sm text-slate-300">Log income</div>
                              <div className="text-lg font-semibold mt-1 text-white">Track real money</div>
                            </div>
                            <Input value={incomeInput} onChange={(e) => setIncomeInput(e.target.value)} placeholder="Enter amount" className="bg-slate-900 border-slate-700 rounded-xl text-white placeholder:text-slate-400" />
                            <Button className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300" onClick={addIncome}><DollarSign className="mr-2 w-4 h-4" /> Log income</Button>
                            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-sm leading-6 text-slate-100">
                              <div className="flex items-center gap-2 font-semibold text-white"><TrendingUp className="w-4 h-4 text-emerald-300" /> Guidance</div>
                              <p className="mt-2">{incomeAdvice(totalIncome, activePath)}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                          <CardContent className="p-5">
                            <div className="grid sm:grid-cols-3 gap-4">
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 min-h-[112px] flex flex-col justify-between overflow-hidden">
                                <div className="text-sm text-slate-300">Total income</div>
                                <div className="text-[clamp(1.4rem,3.6vw,2.4rem)] font-bold mt-1 text-white break-all leading-tight">${totalIncome}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 min-h-[112px] flex flex-col justify-between">
                                <div className="text-sm text-slate-300">Entries</div>
                                <div className="text-3xl font-bold mt-1 text-white">{incomeLog.length}</div>
                              </div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 min-h-[112px] flex flex-col justify-between sm:col-span-3 lg:col-span-1">
                                <div className="text-sm text-slate-300">Business type</div>
                                <div className="mt-3">
                                  <span className="inline-flex w-full items-center justify-center rounded-full border border-slate-600 bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white leading-5">{activePath.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-5">
                              {RANGE_OPTIONS.map((range) => (
                                <Button key={range} variant={incomeRange === range ? 'default' : 'outline'} className={incomeRange === range ? 'rounded-2xl bg-sky-400 text-slate-950' : 'rounded-2xl border-slate-600 bg-transparent text-white hover:bg-slate-900'} onClick={() => setIncomeRange(range)}>
                                  {range === '1W' ? 'Last week' : range === '1M' ? 'Month' : range === '6M' ? '6 months' : range === '1Y' ? 'Year' : 'Lifetime'}
                                </Button>
                              ))}
                            </div>
                            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 p-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                                <div>
                                  <div className="text-sm text-slate-300">Income trend</div>
                                  <div className="text-2xl font-bold text-white mt-1">${totalIncome.toLocaleString()}</div>
                                </div>
                                <div className="text-emerald-300 text-sm font-semibold">{incomeLog.length > 1 ? '↗ Building momentum' : 'Start logging to build trend'}</div>
                              </div>
                              <div className="text-xs text-slate-400 mb-3 flex justify-between gap-3 flex-wrap">
                                <span>{getYAxisLabel()}</span>
                                <span>{getXAxisLabel(incomeRange)}</span>
                              </div>
                              <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={chartData} margin={{ top: 8, right: 12, left: 6, bottom: 8 }}>
                                    <CartesianGrid vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} interval="preserveStartEnd" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={52} />
                                    <Tooltip cursor={{ stroke: '#334155', strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff' }} formatter={(value) => [`$${value}`, 'Income']} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || 'Date'} />
                                    <Line type="monotone" dataKey="income" stroke="#38bdf8" strokeWidth={4} dot={false} activeDot={{ r: 5, fill: '#38bdf8', stroke: '#e2e8f0', strokeWidth: 2 }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="progress" className="mt-6">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-2 text-slate-200 text-sm"><Layers3 className="w-4 h-4 text-sky-300" /> Saved paths in progress</div>
                        {savedPaths.map((path) => {
                          const taskSet = calendarTasks[path.id] || [];
                          const completed = taskSet.flatMap((d) => d.tasks).filter((t) => t.done).length;
                          const total = taskSet.flatMap((d) => d.tasks).length || 1;
                          const pct = Math.round((completed / total) * 100);
                          return (
                            <div key={path.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                              <div>
                                <div className="text-xl font-semibold text-white">{path.title}</div>
                                <div className="text-sm text-slate-300 mt-1">{path.category}</div>
                                <div className="text-sm text-slate-200 mt-2">{completed} of {total} task instances completed</div>
                              </div>
                              <div className="flex gap-3 flex-wrap items-center">
                                <Badge className="bg-slate-900 text-white border-slate-600">{pct}% progress</Badge>
                                <Button className="rounded-2xl bg-sky-400 text-slate-950 hover:bg-sky-300" onClick={() => setActivePath(path)}>Open</Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="projections" className="mt-6">
                      <div className="grid gap-6">
                        <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                          <CardContent className="p-6 grid gap-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="text-sm uppercase tracking-wider text-sky-200">Predictions</div>
                                <div className="text-2xl font-semibold mt-2 text-white">Projected income based on current execution</div>
                                <p className="text-slate-300 mt-2 max-w-2xl">These are estimates based on your logged income, task completion, consistency, and the scaling potential of your current business model.</p>
                              </div>
                              <Badge className="bg-slate-900 text-white border-slate-600">Confidence: {projections.confidence}</Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">Week</div><div className="text-3xl font-bold mt-2 text-white">${projections.week.toLocaleString()}</div></div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">Month</div><div className="text-3xl font-bold mt-2 text-white">${projections.month.toLocaleString()}</div></div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">3 Months</div><div className="text-3xl font-bold mt-2 text-white">${projections.threeMonths.toLocaleString()}</div></div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">6 Months</div><div className="text-3xl font-bold mt-2 text-white">${projections.sixMonths.toLocaleString()}</div></div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">Year</div><div className="text-3xl font-bold mt-2 text-white">${projections.year.toLocaleString()}</div></div>
                              <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5"><div className="text-sm text-slate-300">5 Years</div><div className="text-3xl font-bold mt-2 text-white">${projections.fiveYears.toLocaleString()}</div></div>
                            </div>
                            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5 text-sm leading-7 text-slate-100">
                              <div className="font-semibold text-white mb-2">Why this estimate looks like this</div>
                              <p>Your projection uses recent income entries, your current task completion level, your streak, and the scale potential of <span className="font-semibold text-white">{activePath?.title || 'your current path'}</span>. Higher consistency and repeat income push the estimate upward. Weak completion or little income history lowers confidence and keeps the forecast conservative.</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-sm leading-7 text-slate-100">
                              <div className="font-semibold text-white mb-2">How to improve the forecast</div>
                              <p>Complete daily tasks consistently, log income honestly, and stay on one path long enough to build proof. Once you move from setup and outreach into repeatable income, the longer-term projections become more believable.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="paywall" className="mt-6">
                      <Card className="bg-slate-800 border-slate-700 rounded-2xl">
                        <CardContent className="p-6 grid gap-5">
                          <div>
                            <div className="text-sm uppercase tracking-wider text-sky-200">Unlock your execution system</div>
                            <div className="text-2xl font-semibold mt-2 text-white">This is not a purchase. It is an investment in your ability to make money.</div>
                            <p className="text-slate-200 mt-2">Most people stay stuck because they do not know what to do next. This gives you the structure, accountability, and repetition that actually produces results.</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {PLAN_OPTIONS.map((plan) => (
                              <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} className={`rounded-2xl p-5 border text-left transition ${selectedPlan === plan.id ? 'border-sky-400 bg-sky-500/10' : 'border-slate-700 bg-slate-900'} ${plan.highlight ? 'ring-1 ring-emerald-400/30' : ''}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-slate-300">{plan.label}</div>
                                  {plan.highlight && <Badge className="bg-emerald-500/15 text-emerald-100 border-emerald-400/30">Best commitment</Badge>}
                                </div>
                                <div className="text-3xl font-bold mt-2 text-white">{plan.price}</div>
                                <div className="text-sm text-emerald-300 mt-1">{plan.intro}</div>
                                <div className="text-sm text-slate-100 mt-3 leading-6">{plan.note}</div>
                              </button>
                            ))}
                          </div>
                          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-slate-100 leading-6">
                            <div className="flex items-center gap-2 font-semibold text-white"><Crown className="w-4 h-4 text-emerald-300" /> Why yearly wins</div>
                            <p className="mt-2">Yearly members are far less likely to stop and restart. More consistency usually means better execution, more logged income, and stronger long-term results.</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-sm leading-6 text-slate-100">Selected plan: <span className="font-semibold text-white">{selectedPlanData?.label}</span></div>
                          <div className="flex flex-col md:flex-row gap-3">
                            <Button className="rounded-2xl bg-sky-400 text-slate-950 hover:bg-sky-300 flex-1">Start My Plan</Button>
                            <Button variant="outline" className="rounded-2xl border-slate-600 bg-transparent text-white hover:bg-slate-900 flex-1">Cancel anytime</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6">
              <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardDescription className="text-slate-300">Mentor assistant</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-white"><Bot className="w-5 h-5 text-sky-300" /> Ask direct questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 rounded-2xl border border-slate-700 bg-slate-800 p-4">
                    <div className="grid gap-3">
                      {chat.map((message, i) => (
                        <div key={i} className={`rounded-2xl p-3 text-sm leading-6 ${message.role === 'assistant' ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-sky-500/15 border border-sky-400/30 text-sky-50'}`}>{message.text}</div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Why this path? What should I do next?" className="bg-slate-800 border-slate-700 rounded-xl text-white placeholder:text-slate-400" />
                    <Button className="rounded-xl bg-sky-400 text-slate-950 hover:bg-sky-300" onClick={sendChat}>Ask</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardDescription className="text-slate-300">Progress feedback</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-white"><CheckCircle2 className="w-5 h-5 text-emerald-300" /> Stay in execution mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 text-sm leading-6 text-white">
                    {feedback}
                    <div className="mt-3 text-slate-300 text-xs uppercase tracking-wider">Current state: {getExecutionState(totalIncome, streak, completedTaskCount)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardDescription className="text-slate-300">Current path snapshot</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-white"><CalendarDays className="w-5 h-5 text-sky-300" /> What awaits you</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 text-sm leading-6 text-slate-100">{selectedDay?.tasks?.[0]?.text || 'Pick a day on the calendar to preview the next action.'}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


