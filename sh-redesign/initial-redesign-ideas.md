# Initial redesign ideas

Source: *Humanist Organizer Playbook*, AHA Organizing Team, 2026 edition (Jake Via),
file `Humanist Organizer Playbook 08212026.pdf`. Page numbers below are the
playbook's printed page numbers.

**The rule this whole doc serves:** a local humanist group's website exists to
turn a lonely stranger into someone who shows up. Everything else is secondary.

How this doc is laid out:

- **Part 1** pulls every website-related idea out of the playbook, with page refs.
- **Part 2** compares the current site against Part 1.
- **Part 3** is new ideas, most of them outside the box, some I'd expect you to
  reject. Each one has an ID (N1, N2, …) so we can refer to them later.
- **Part 4** lists the places where the playbook and our current setup disagree.
  These are the decisions to make before we design anything.
- **Part 5** is ideas worth sending back to Jake and other groups.

Tags: **[PB p.N]** = straight from the playbook. **[New]** = not in the playbook.

---

## Decisions and stages (start here)

### Ground rules for the demo site

- **It's a demo.** Placeholder content is fine: made-up text, made-up email
  (`welcome-demo@stanislaus-humanists.org`), photos from the internet.
- **Custom code, no limits.** Ignore any future migration (to Squarespace or
  anything else). We'll deal with that later.
- **Events:** keep reading the Meetup feed. Every RSVP button points at a mock
  ActionNetwork link.
- **Signup and contact:** mock ActionNetwork forms.
- **Donations:** mock Zeffy. Three monthly levels ($5 / $15 / $25) plus "Other."
  Choosing the real platform is a separate project:
  [donation-platform-options.md](donation-platform-options.md).
- **Membership:** everyone who signs up is a member. People who give money are
  donors, with levels. No paid dues.
- **The one button:** "RSVP for [next event]." An ActionNetwork RSVP also adds the
  person to the email list, so it does both jobs. Under it, a quiet text link:
  "Not ready? Get the monthly email."
- **No RSVP counts.** Show past turnout instead ("Last time: 14 people").
- **Left out for now:** chat (Discord etc.), the photo-consent process.

### Group 1 — Above the fold, mobile and desktop

Design and mock only what's visible before scrolling, on a phone and on a
desktop. It has to pass the Stranger Test (1.8):

- Town named in the first line.
- Next event: title, day, date, time, venue.
- The one button, plus the quiet email link.
- Freshness line: "Last gathering: [date], [event], [N] people" (N1).
- A photo of real-looking people.

### Group 2 — The rest of the demo

- "Your first visit" page, with a short note per event type (N11).
- Venue cards: entrance photo, parking, accessibility, where we sit (N6).
- "Meet you at the door" form (N12).
- Add-to-calendar and "remind me" buttons (N9).
- Newcomer quotes (N14).
- Email signup in every page footer (N19).
- RSVP buttons → mock ActionNetwork (N21).
- Empty-calendar fallback message, with no organizer alert yet (N2).
- Rewritten opening copy, belonging first.
- Signup-is-membership page and Zeffy donor page with levels (N39).
- Privacy promise, text only (N24).
- Code of conduct page (N37). Also link it from Meetup events if possible.
- Program Bracket, as a non-working mockup (N35).

### Group 3 — Backlog

Event color-coding by Mind / Each other / World (N8), walk-in video (N13), member
spotlights (N15), welcome email sequence (N20), "How did you hear about us?"
(N22), lurk-first page without chat (N23), "Just left religion?" resources
(N27), seasonal pages (N28), secular life-events page (N29), town landing pages
(N30), Spanish version (N31), "Our year" page (N36), press page (N42), partner
strip (N43), automated site checks (N46), choosing one donation platform.

### Future (parked, not scheduled)

Organizer alert when the calendar empties, and the monthly site reminder (N2
alert, N3); impact counters (N4); "good first event" tag (N7); text-message
signup (N10); self-refreshing photo strip and faces-optional rule (N16, N17);
photo consent habit; anonymous question box (N25); humanist quiz (N32); wonder
of the week (N33); small-jobs board (N34); carpool board (N38); event QR card
(N41); runbook (N45); Front Porch Score checker; Meetup/ActionNetwork starter
kit for other groups (near future); event-to-social-post generator.

### Likely reject / dropped

Quick-exit button (N26). Dropped: per-visitor button (N18, replaced by the "one
button" decision), non-coder editing (N44, migration is ignored for now), chat
links.

### Your own tasks (from your comments)

- Compare the seven-principle list with AHA's new four and document it.
- Stranger-test the demo on a phone.
- Run the accessibility audit (steps in chat; can be added here).
- Google Business Profile: register as a service-area business (Google won't
  accept a PO box).
- Front Porch Tune-up: revise the "Why" line under "Any other item can be set
  aside" (local members know things a checklist can't…) in
  `front-porch-tune-up/README.md`. Marked with a TODO comment there.

---

## Part 1 — What the playbook says about websites

### 1.1 The job of the site

- **The website is the "front porch."** It's where a curious stranger checks that
  you're real, current and welcoming, and finds the time and place.
  [PB p.19, p.23]
- **Design for "Tuesday Night Person."** Someone who just left their church, just
  moved to town, or just had a baby. It's 11:30pm on a Tuesday and they're on
  their phone searching "atheist group near me" or "secular community
  [town]." In **under 30 seconds** they need to find four things: [PB p.20]
  1. That you exist and are real, current, and not defunct.
  2. When and where you meet next: an actual date and place, ideally with an
     RSVP count showing that other people are going.
  3. What it'll be like to walk in: photos of real people smiling, and a
     plain-language "what to expect at your first visit" paragraph. *"Your
     website's job is to pre-introduce the room."*
  4. **One obvious next step:** a single friendly button ("Come to taco night,"
     "Join our newsletter," "Say hi on Discord"). One button, not nine.
- History, board bios and the values statement are "lovely" but secondary. The
  first 30 seconds is the opportunity. [PB p.21]
- **Brochure vs. front porch.** 
	- A **brochure** says "here is information about an
  organization." 
	- A **front porch** says "we're out here most evenings, pull up a chair."
	  - The difference is *signs of life*. [PB p.21]
- *"The website doesn't need to be impressive. It needs to be true, current, and
  warm."* [PB p.25]

### 1.2 Three signs of life (these beat a redesign) [PB p.21]

1. **A calendar that's actually true.** Non-negotiable. An out-of-date calendar
   is worse than none. If you run on Meetup, ActionNetwork or Facebook Events,
   embed the feed so it updates itself.
2. **Recent photographic evidence of joy.** Three photos from last month beat
   thirty from 2018. Show people laughing, eating, holding a trash bag at the
   river cleanup. Requires a consent habit (see 1.7).
3. **A date stamp newer than the milk in your fridge.** One fresh thing: a
   one-paragraph recap, a photo dump, a book club pick. Put 15 minutes a month on
   the calendar to post an update.

### 1.3 Anti-patterns to check for [PB p.19]

- An event from two years ago listed as "upcoming."
- A photo of six people in a dull meeting room, one of whom moved to Florida.
- A most-recent blog post titled "Welcome to our new website!"

### 1.4 Email: the only audience you own [PB p.22]

- Social platforms are rented. Email is "algorithm-proof, ban-proof,
  billionaire-acquisition-proof" and has the highest show-up rate.
- **A signup form on every page of the site**, a link in every social bio, and a
  paper sheet at every event.
- Send on a rhythm (monthly is plenty): what happened, what's next, one way to
  help.
- **AHA provides ActionNetwork free, with training.** Use it for lists and RSVPs.
  [PB p.22, p.39]

### 1.5 The ecosystem map: every piece points one step deeper [PB p.23]

| Stage | Tool | Job |
|---|---|---|
| Discovery ("the flyer") | Social media | Get noticed; earn one click |
| Verification ("the front porch") | **Website** | Confirm you're real, current, welcoming; give time and place |
| Retention | Email | Reliably reach people who opted in |
| Belonging | Chat (Discord, Slack, group text) | Where community happens between events |

The Instagram bio links to the website. The website's big button captures an
email. The welcome email invites them to taco night and the Discord. If one link
breaks, Tuesday Night Person falls through and "usually doesn't try twice."

### 1.6 Tools, SEO, mobile, accessibility [PB p.24]

- **Use boring tools:** Squarespace, Wix, WordPress.com, Google Sites. A
  hand-coded site has *"a single point of failure named Greg."* Any reasonably
  motivated volunteer should be able to update it after 30 minutes of training.
- **Two people minimum hold the keys** to site, socials and email list. Use a
  shared password manager (Bitwarden free org tier) and 2FA everywhere.
  [PB p.24, p.42]
- **Say your city out loud.** Put "[Your Town]'s community for humanists,
  atheists, agnostics, and the friendly-curious" at the top of the homepage.
  "90% of the SEO you need." The other 10%: a free **Google Business Profile**
  so you show up on the map.
- **Check it on your phone.** Most visitors, and nearly every Tuesday Night
  Person, are on phones. No pinch-zooming to find the meeting time.
- **Make it readable by everyone:** contrast, alt text, captions on videos.
  "Accessibility is radical empathy applied to web design."

### 1.7 Things you can skip [PB p.25]

A blog, a podcast, a custom app ("never, please, I beg you"), a mission
statement carousel, a $4,000 redesign.

### 1.8 The Stranger Test (Play #3) [PB p.26]

Hand the site on a phone to someone who's never seen it: "You're thinking about
coming to an event. You have 60 seconds. Go." Don't coach. Then ask:

1. When's the next event?
2. What would you wear?
3. Would you go alone?

If they can't answer all three, *"you don't have a redesign problem, you have a
homepage problem."* Fix the top of one page, test again with a new stranger.

### 1.9 Content the site could carry (from other chapters)

**Photos and member privacy** [PB p.21, p.42]
- Consent at every event (red cup, lanyard, "no-photo side"). Some members'
  families or employers don't know.
- Pseudonyms welcome in community spaces.
- **Home addresses only after RSVP.** The public listing gives the neighborhood;
  the exact address goes out with the RSVP confirmation.
- Lockdown checklist item: *"Google your group like a stranger and look at what's
  public — any member faces or home addresses that shouldn't be?"* [PB p.44]

**Story formula for all copy** [PB p.33]
- "A person, a moment, an open door." Skip "The Greater Tulsa Humanist Society
  is pleased to announce…"
- Specific beats general: "Dave taught four people to change a tire in the
  parking lot" beats "We build community."

**Content types to rotate** [PB p.33–34]
- Faces and stories (member spotlights; see Play #5 below).
- Wonder ("awe in the ordinary," Sagan voice).
- **Useful:** "How to politely survive a religious family holiday," "Secular grief
  resources that actually helped our members," "What to say when your kid asks
  what happens when we die." *Useful gets saved, shared and found.*
- Funny (punch up or inward, never down; the "potluck test").

**Member spotlights (Play #5)** [PB p.40]: three sentences (how they found you,
a moment in the group, what they'd tell someone thinking about coming), plus a
photo, with permission. One a month = twelve true stories a year.

**Content Potluck harvest (Play #4)** [PB p.32]: per event, 5 candid photos,
1 twenty-second video, 1 quote from a newcomer ("I didn't know this existed in
our town").

**Chat** [PB p.35–38]: Discord (AHA has state channels a local group can take
over), five starter channels, pinned "porch rules." Signal for leadership.
Facebook Group for 45+. Skip WhatsApp.

**Meetup vs. ActionNetwork** [PB p.38–39]: Meetup is a *discovery* billboard and
increasingly expensive. Count humans, not RSVPs. "Post it everywhere, RSVP
somewhere you own." Gulf Coast Humanists (Biloxi) put ActionNetwork RSVP links
on their website, Instagram and TikTok and grew to 400+ actual attendees in a
year.

**Livestream / recording archive** [PB p.47]: every talk recorded. *"For every
person in your folding chairs, there's someone watching from a town — or a
marriage — where attending isn't safe yet. Livestreams are how Tuesday Night
Person lurks before they leap."* The archive "recruits while you sleep."

**Press kit (Play #7)** [PB p.48]: who you are in two sentences, what you do in
town with numbers, two photos, one quotable spokesperson with contact info.
Offer the group as available for comment.

**Deed before creed** [PB p.49–52]: one visible, recurring service commitment
(adopt a river mile, food bank every 2nd Saturday). "Post the joy." Numbers
(pounds of trash, meals) are story material.

**Rule of Thirds calendar** [PB p.53]: balance events across *Feed the mind*
(book club, Socrates Café), *Feed each other* (potlucks, game night, solstice),
and *Feed the world* (service).

**Programs that draw newcomers** [PB p.54]: secular parenting meetup, grief and
transitions circle, holiday alternatives ("December is the loneliest month for
the secular; be the warm room"), death café / last lecture, science outings.

**Program Bracket (Play #9)** [PB p.55]: members vote on program ideas
head-to-head. "People show up for things they helped choose."
- Carl: I like this idea a lot !!

**Code of conduct** [PB p.36, p.61]: short, warm, public. "A group that tolerates
everything belongs to whoever behaves worst."
- Carl: A must have for the site and for meetup events if possible.

**Celebrate / Year as a Story (Play #12)** [PB p.63–64]: wins announced, annual
story, silly awards, the "Front Porch Award" voted by newcomers.

**Fundraising** [PB p.65–67]
- Three principles: **transparency** (pie chart: "your money became venue rent,
  port-a-potty for the river cleanup…"), **easy** (three taps on a phone, QR
  code), **gratitude** (thank every gift fast and personally).
- Recurring micro-donations via Zeffy, GiveButter or ActBlue. Three buttons:
  **$5 / $15 / $25 per month**, with last year's spending pie chart next to them.
	- Carl: OK, that is 3, I was thinking 1 but does using all 3 at the same time bring in more people and donations?
- **Dues: suggested levels, pay-what-you-can, nobody turned away or outed.**
  *"The moment membership has a hard paywall, you've said that belonging costs
  money."*
	- Carl: Yes, this.
- No guilt, no surprise asks.

**Core principles (new AHA framing)** [PB p.7]: Fierce & Playful Curiosity;
Radical Empathy & Compassion; The Sobering But Thrilling Responsibility; Awe in
the Ordinary.

---

## Part 2 — Current site vs. the playbook

Based on the current code (`app/src/`), as of commit `9366fd7`.

| Playbook asks for                          | Current site                                                                | Status                                                                            | Carl<br>Comment                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| City named at the top                      | H1 is "Welcome to Stanislaus Humanists!" No town in the first line.         | Gap                                                                               | Fix                                                                                                       |
| Next event, date and place, above the fold | Next two events, pulled from the Meetup iCal feed, *below* a long paragraph | Partly there. The data is right (automated, as PB p.21 asks); the placement isn't | Fix                                                                                                       |
| RSVP count as social proof                 | Not shown                                                                   | Gap                                                                               | Not sure our RSVP count is high enough to draw people in. Maybe a count of 3 will discourage people.      |
| "What to expect at your first visit"       | None                                                                        | **Biggest gap**                                                                   | Fix. I wonder if this can be for all events or needs to be per event type?                                |
| Recent photos of real people               | None                                                                        | Gap                                                                               | We will find some on the web and use until we get some actual ones. This is a demo site                   |
| One obvious button                         | No primary call to action. Links go to Meetup                               | Gap                                                                               | Fix                                                                                                       |
| Email signup on every page                 | None. Contact is a `mailto:` and a PO box                                   | Gap                                                                               | Fix: welcome-demo@stanislaus-humanists.org<br><br>Doesn't exist but this is a demo site.<br>              |
| Freshness stamp / recent update            | Events are fresh. Nothing else is dated                                     | Partial                                                                           | Fix                                                                                                       |
| Mobile-first                               | Built responsive. Not yet Stranger-Tested on a phone                        | Unknown                                                                           | I/we will do it.                                                                                          |
| Accessibility                              | Not audited                                                                 | Unknown                                                                           | Tell me how to audit it.                                                                                  |
| Search basics                              | Canonical, Open Graph, JSON-LD for org, events and FAQs, `areaServed`       | Ahead of most groups. Google Business Profile status unknown                      | How does this relate to thee website?                                                                     |
| Opening copy                               | A dense paragraph defining Humanism ("In a nutshell…")                      | Lecture-first; the playbook says belonging-first                                  | Fix                                                                                                       |
| Membership                                 | $24 / $36 per year, fixed                                                   | Conflicts with "pay-what-you-can"                                                 | Fix - mockup, it's a demo                                                                                 |
| Principles                                 | "Seven Core Principles" list                                                | Older framing; AHA now leads with four                                            | Task for me: I'll look at both - document it.                                                             |
| Donations                                  | None                                                                        | Gap                                                                               | New thinking: Everyone who signs-up is a "member", people who give money are donors. We will have levels. |
| Chat link (Discord etc.)                   | Facebook Group link in socials                                              | Exists, not framed as "the campfire"                                              | I'm not sold on this idea yet. Leave it out.                                                              |
| Easy to edit by non-coders                 | Custom SolidJS app on Cloudflare                                            | **The "Greg" problem** (Part 4)                                                   | We will migrate at a future date. Ignore this for now.                                                    |

---

## Part 3 — New ideas (thinking outside the box)

Grouped by which of the playbook's four questions they serve. Expect to reject
plenty of these.

### A. "Are you real and current?"

- **N1. Automatic freshness line.** Under the hero: "Last gathering: Oct 11,
  Taco night, 14 people." Built from the Meetup feed's past events. The site
  proves it's alive without anyone writing anything. [New]
	- Carl: include (in demo site - this branch)
- **N2. Dead-man's switch.** If the feed has no future event, the site doesn't
  show an empty list. It switches to "We meet most months — join the list and
  we'll tell you the next date," and emails the organizers that the calendar has
  gone dark. [New]
	- Carl: what is the alternative? (I think/Claude you had a proposal)
- **N3. Monthly "porch sweep" reminder.** A scheduled job emails two organizers
  on the 1st: "Last site update was 34 days ago. Here's the 15-minute
  checklist." Turns PB p.21's 15-minutes-a-month into a system. [New]
	- Carl: good idea. Log for future consideration.
- **N4. Live impact counters.** "Pounds of trash picked up: 1,240. Meals served:
  380." Deed-before-creed as a homepage element. Only works if we adopt a
  recurring service commitment. [New, from PB p.49]
	- Carl: save for future consideration.

### B. "When and where is the next one?"

- **N5. Hero = next event.** Above the fold, on a phone: town, next event title,
  day/date/time, venue, a photo of the venue, and the one button. Everything
  else scrolls. [PB p.20, made concrete]
	- Carl: Do it
- **N6. Venue cards with the scary details answered.** We already have
  `eventLocations.ts`. Add per venue: a photo of the *entrance*, parking,
  wheelchair access, "we're at the big table in the back," kid-friendly or not,
  alcohol or not. [New]
	- Carl: Do it
- **N7. "Good first event" tag.** Mark which events suit newcomers (potluck: yes;
  board meeting: no). Filter the homepage to show the next good first event.
  [New]
	- Carl: future item
- **N8. Rule-of-Thirds color coding.** Tag each event Mind / Each other / World.
  Visitors see the variety; organizers see when the calendar is lopsided.
  [New, from PB p.53]
	- Carl: let's do things in stages. Idea Group 1, Idea Group 2. This one goes to Idea Group 2.
- **N9. Add-to-calendar and "remind me" buttons** (.ics download; email or SMS
  reminder the day before). The reminder doubles as an email capture. [New]
	- Carl: do it.
- **N10. Text-message signup.** "Text HUMANIST to …" for people who'll never
  read a newsletter. Costs money (Twilio etc.); likely reject. [New]
	- Carl: future item

### C. "What will it be like to walk in?"

- **N11. A "Your first visit" page**, linked from every event. Answers the
  Stranger Test questions outright:
  - What to wear ("whatever you'd wear to a coffee shop").
  - Can I come alone? ("Most people's first visit is solo.")
  - Who will greet me (photo and first name of this month's greeter).
  - What happens in the first 10 minutes.
  - Do I have to talk / say what I believe? ("No. Plenty of people just
    listen.")
  - Do I have to be an atheist? ("Nope. Curious is enough.")
  - Kids? Cost? Will anyone try to recruit or debate me?
  [PB p.20 asks for it; the content is new]
- **N12. "Want someone to meet you at the door?" form.** Name and which event.
  The greeter gets a heads-up and looks for them. It removes the scariest part of
  a first visit. It also captures an email. [New. Strong candidate]
- **N13. A 30-second "walk-in" video.** Phone footage from the door to the
  table: noise, room, people waving. Pre-introduces the room literally. [New]
- **N14. Rotating newcomer quotes** from the Content Potluck harvest: "I didn't
  know this existed in Modesto." [PB p.32 → site]
- **N15. Member spotlights page**, using the three-sentence formula, one a
  month. [PB p.40 → site]
- **N16. Photo strip that refreshes itself.** The Documentarian drops photos
  into a shared folder; the site shows the latest event's photos. Consent stays
  manual: only photos someone has approved get published. [New]
- **N17. "Faces optional" rule built into the photo pipeline.** Default to
  backs-of-heads, hands, food and wide shots; close-ups only with recorded
  consent. Protects members who aren't out. [New, from PB p.42]

### D. "What's the one next step?"

- **N18. One primary button per page, chosen per visitor stage.** First visit:
  "Come to [next event]." Returning visitor: "Join the email list." We could
  remember the visit in localStorage; no tracking needed. [New]
- **N19. Email signup in the footer of every page** via ActionNetwork embed.
  [PB p.22]
- **N20. Welcome email sequence** (three emails over two weeks): who we are and
  the next event; a member's story; the invite to the chat. [PB p.23 sketches
  the chain; the sequence is new]
- **N21. RSVP through ActionNetwork, keep Meetup as the billboard.** "Post it
  everywhere, RSVP somewhere you own." [PB p.39]
- **N22. "How did you hear about us?"** on every RSVP/signup. Tells us whether
  Meetup's fee is worth it ("count humans, not RSVPs"). [New, serves PB p.38]

### E. For the person who can't safely show up yet (the "lurker")

- **N23. "Lurk first" path.** A page that says outright: "Not ready to come in
  person? That's fine," then links the YouTube talk archive, the newsletter and
  the chat. [PB p.47 → site]
- **N24. Privacy promise in plain words.** "No tracking pixels, no ads, no
  Facebook/Google trackers on this site. We never share our list." Make it true
  (privacy-friendly analytics only). [New]
- **N25. Anonymous question box.** "Ask us anything, no name needed." Good
  answers become public FAQ entries. Spam risk. [New]
- **N26. Discreet-mode link** ("leave this site quickly," the button DV-support
  sites use). Probably overkill for us, but it shows we've thought about members
  at risk. Likely reject. [New]

### F. Being useful (content that gets found by search)

- **N27. "Just left religion?" resources page.** Recovering from Religion,
  Secular Therapy Project, Grief Beyond Belief, AHA resources, plus "come talk to
  real people locally." The most searchable page we could have. [New, from PB
  p.34 "Useful"]
- **N28. Seasonal pages.** "Surviving a religious family holiday" (Nov–Dec),
  "Secular solstice in Modesto," "Darwin Day." December is the loneliest month;
  be findable then. [PB p.34, p.54]
- **N29. Secular life-events page.** Humanist celebrants for weddings, funerals
  and baby namings in the valley. Real search demand, and genuinely helpful.
  [New]
- **N30. Town landing pages.** "Humanists in Turlock / Stockton / Merced /
  Sonora," each saying honestly "we meet in Modesto, here's the drive time and
  carpool." Same content, findable by town. Could look spammy; keep it to a few.
  [New, extends PB p.24 "say your city"]
- **N31. Spanish-language version** of the homepage and first-visit page. The
  northern San Joaquin Valley is heavily Hispanic, and many people leaving
  Catholicism or evangelical churches have no secular community in Spanish. No
  local group seems to do this. [New]
- **N32. "Are you a humanist and don't know it?" quiz.** Five questions,
  shareable result. Jake: "most humanists in America just don't know the word
  yet" (PB p.51). Gimmicky; might work on social. [New]
- **N33. "Wonder of the week."** An astronomy photo or science fact with a
  one-line caption. Signs of life with zero organizer effort if automated (NASA
  APOD). Risk: filler that hides the lack of real updates. [New, from PB p.34]

### G. Members and belonging (beyond the newcomer)

- **N34. Small-jobs board.** "Bring cups Thursday," "Documentarian for the
  potluck." One click to claim. PB p.59: "People stay because they're needed."
  [New]
- **N35. Program Bracket on the site.** Members vote head-to-head on next
  quarter's program ideas. [PB p.55 → site]
- **N36. "Our year" page.** The annual Year-as-a-Story, with photos and
  numbers, archived per year. It becomes the group's mythology and proof of
  life. [PB p.64 → site]
- **N37. Public code of conduct / "porch rules" page.** Tells newcomers this is
  a safe room, before they arrive. [PB p.36, p.61]
- **N38. Carpool board** for members outside Modesto. [New]

### H. Money

- **N39. Donate page:** $5 / $15 / $25 monthly buttons (Zeffy is free for
  nonprofits), last year's spending pie chart beside them, a thank-you wall
  (with permission). [PB p.65–67]
- **N40. Pay-what-you-can membership.** Suggested levels, with $0 allowed.
  [PB p.66]
- **N41. QR code card for events** that opens the donate and signup page on the
  phone. [PB p.65]

### I. Media and partners

- **N42. Press page:** two-sentence description, numbers, downloadable photos,
  spokesperson contact, "available for comment on church/state questions."
  [PB p.48]
- **N43. "Friends of the group" partner strip.** Interfaith council, food bank,
  hiking club, banned-books group. Signals that we're a good neighbor, not an
  argument. [New, from PB p.51]

### J. Keeping the site alive (the Greg problem)

- **N44. Non-coder editing.** Keep the custom site, but move all text, FAQs,
  board and spotlights into something a volunteer can edit without code: a
  Google Sheet, a headless CMS (Decap, TinaCMS), or Markdown files edited on
  GitHub's web UI. The site rebuilds on save. [New; answers PB p.24]
- **N45. A one-page runbook** in the shared password vault: where the domain,
  Cloudflare, GitHub and email live, who has access, how to post an update.
  [PB p.24, p.42]
- **N46. Automated Stranger Test proxies.** A CI check that fails if: the
  homepage doesn't name the town; there's no future event; the next event is more
  than 6 weeks out; any image lacks alt text; the mobile Lighthouse score
  drops. [New]

---

## Part 4 — Decisions to make first

These are places where the playbook and our setup pull in different directions.

1. **Custom code vs. "boring tools."** The playbook says use Squarespace and
   avoid a Greg. We have a hand-built site, and you're the Greg. Options: keep
   custom but Greg-proof it (N44–N46), or move to Squarespace and accept less
   control. The Meetup feed automation is a point in favor of custom: it does
   the "calendar that's actually true" better than most Squarespace groups
   manage.
	1. Carl: Custom code. We will migrate at a later date. Give no consideration to any restrictions that migration may impose. We are brainstorming like people without limits.
2. **Meetup vs. ActionNetwork as the RSVP home.** Today everything points at
   Meetup. The playbook says Meetup is the billboard and ActionNetwork is where
   you keep people's emails. Moving RSVPs means changing how events are created.
	1. Carl: I want to switch to ActionNetwork but it needs board approval and the work to setup ActionNetwork. This demo site will assume we are using ActionNetwork for events and for sign-up / contact form.
3. **Fixed dues vs. pay-what-you-can.** The current $24/$36 a year conflicts
   with "nobody turned away." That's a board decision, not a website one.
	1. Carl: New strategy is in an above section.
4. **What the one button is.** "Come to the next event" (Meetup or ActionNetwork
   RSVP) or "Join the email list." The playbook's chain suggests email, but the
   Biloxi example suggests the event RSVP that also captures email.
	1. Carl: gosh, can't we do both.
5. **Photos and consent.** We have no photos today. Getting them means
   starting the consent habit at events first.
	1. Carl: future item
6. **Lecture-first vs. belonging-first homepage.** The current homepage leads
   with a definition of Humanism. The playbook says lead with the town, the next
   event and the people. The definition moves down or to About Humanism.
	1. Carl: Yes, the current site sucks. This demo site is an attempt to fix that.

---

## Part 5 — Ideas to share back with Jake and other groups

Ideas that go beyond the playbook and would help groups other than ours:

- **A "Front Porch Score" checker.** Paste any group's URL and get a
  pass/fail on the Tuesday Night Person test: names the town? future event
  visible? date within 6 weeks? email signup? mobile-friendly? alt text?
  Mostly automatable (N46 generalized). AHA could run it across every chapter
  and affiliate.
	- Carl: Good one: future
- **A Meetup-feed-to-website starter kit.** What this site already does
  (read the iCal feed, render the next events with structured data) as a
  template any group could deploy. Takes care of the "calendar that's actually
  true" for groups stuck on Meetup.
	- Carl: Yes, I really want to do this for the other groups and another group organizer has already asked about it. We will look into doing the same for ActionNetwork. It's a 'near future' item.
- **A "Your first visit" template** with fill-in-the-blanks (N11). The playbook
  says to write it but doesn't give one.
- **The "meet you at the door" form** (N12) as a standard practice, paired with
  the greeter role from PB p.59.
- **A "lurk first" page template** (N23) for groups in hostile towns.
- **A resources page AHA maintains centrally** (N27), so local sites embed it
  instead of each keeping their own links current.
- **The dead-man's switch** (N2) and the **monthly porch-sweep reminder** (N3):
  systems that keep a volunteer site from going stale, instead of relying on
  willpower.
- **Spanish-language outreach** (N31) as a gap in the movement generally.
- Carl: **Social media posts:** A way to turn events into social media posts on Bluesky, X, etc.
	- Carl: future item.
