export type PreviewId = "echopass" | "chat" | "movies" | "blog";

export const projectStories = {
  echopass: {
    title: "A room becomes a credential.",
    summary: "Open a session, verify presence, and turn a check-in into an attendance record.",
    built: "Teacher and student workflows, audio and location checks, classroom analytics, and signed attendance evidence.",
    decision: "Presence needs fresh evidence. A rotating room signal or a new location check ties verification to the current session.",
    steps: [
      ["Open the room", "The teacher chooses a verification method and opens a check-in window."],
      ["Verify presence", "A student responds to the active room signal or completes a location check."],
      ["See attendance", "The teacher can review check-ins as the session progresses."],
      ["Close with a record", "Ending the session produces a receipt for later review."],
    ],
    captions: [
      "One workspace, two themes. A real light-to-dark switch keeps the dashboard in context.",
      "The classroom directory brings rosters, session counts, and attendance summaries into a single view.",
      "A real interaction in the attendance archive: narrow sessions by verification method.",
      "Switch between location and ultrasound before opening a check-in window. No session is started in this clip.",
      "The updated teacher overview at phone width, in light mode.",
      "Classroom cards reflow into a focused, single-column directory on a phone.",
    ],
  },
  chat: {
    title: "A conversation, kept in sync.",
    summary: "Move into a room, compose a message, and follow its delivery into the conversation.",
    built: "Authenticated spaces and rooms, a persistent message history, realtime events, and browser-native huddles.",
    decision: "A persistent Node server handles authenticated Socket.IO events. WebRTC handles small group calls in the browser.",
    steps: [
      ["Find your room", "Rooms separate conversations inside a shared workspace."],
      ["Compose a message", "Write in context without leaving the conversation."],
      ["Send it through", "The product distributes messages through authenticated Socket.IO rooms."],
      ["Keep the history", "Messages remain available when you return to the room."],
    ],
    captions: [
      "Switch from light to dark without leaving the conversation, recorded in the real demo workspace.",
      "A dedicated people directory keeps workspace membership easy to review.",
      "A short recording of drafting a message in the real composer. No message is sent.",
      "Open quick navigation and narrow the room list without leaving the conversation.",
      "The refreshed light conversation view at phone width.",
      "The mobile navigation drawer brings rooms, direct messages, and huddles within reach.",
    ],
  },
  movies: {
    title: "From discovery to your list.",
    summary: "Inspect a title, save it, and find it again in a personal collection.",
    built: "A responsive discovery interface with title details, search, member profiles, and a persistent watchlist.",
    decision: "TMDB supplies metadata with a curated fallback for dependable browsing. PostgreSQL stores profiles and each profile’s My List.",
    steps: [
      ["Discover a title", "Content rails make the catalogue approachable, one collection at a time."],
      ["Look closer", "Title details add context before you decide what to watch."],
      ["Save for later", "Add a film to My List from its detail view."],
      ["Make it yours", "A saved collection belongs to the selected profile."],
    ],
    captions: [
      "A cinematic lead and content rails give the catalogue a clear starting point.",
      "Save a title from its detail view and find it again in My List.",
      "Catalogue rows support browsing beyond the featured title.",
      "Separate profiles give each viewer their own collection.",
      "Profile controls stay accessible while browsing.",
      "Discovery rails and title context adapt to a narrow screen.",
    ],
  },
  blog: {
    title: "Less searching. More understanding.",
    summary: "Narrow the archive by topic, find an article, and settle into the reading view.",
    built: "A technical publication with topic filters, search, Markdown reading views, and an independent content API.",
    decision: "The Express content API is separate from the Next.js reader. Structured Markdown keeps publishing and presentation independent.",
    steps: [
      ["Browse the notes", "A focused archive introduces the subjects covered in the publication."],
      ["Narrow the topic", "Topic filters reduce the archive to the area you need."],
      ["Find the idea", "Search matches an article’s title and context."],
      ["Start reading", "The article view puts typography and the content first."],
    ],
    captions: [
      "The publication home introduces the latest writing with a clear reading hierarchy.",
      "Topic filters make the technical archive easier to browse.",
      "The reading view gives long-form explanations room to breathe.",
      "The about page explains the publication’s focus and perspective.",
      "Search narrows the archive to articles relevant to the current question.",
      "Responsive typography keeps technical writing readable on a phone.",
    ],
  },
} as const;
