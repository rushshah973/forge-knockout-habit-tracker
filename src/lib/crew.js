// Static mock data — no backend, no accounts, no real friends. This keeps
// the Core's "no accounts, no backend" principle intact while still
// demoing the social-accountability concept visually. A real version needs
// auth + a shared datastore, out of scope for a fast hackathon pass.
export const MOCK_CREW = [
  { name: "Alex", streak: 9 },
  { name: "Priya", streak: 14 },
  { name: "Sam", streak: 4 },
];
