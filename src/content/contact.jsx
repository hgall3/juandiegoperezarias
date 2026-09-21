// Juan Diego's contact details and public profiles.
//
// They live here rather than inside the Footer because the /contacto page needs
// the same email and phone number. Written in one place, they can't drift: a
// corrected digit is corrected everywhere at once.

export const email = 'jdiegoperezarias@gmail.com'

// Spaced the way it is read out loud. A `tel:` link strips the spaces itself —
// what a phone dials and what a person reads are not the same string.
export const phone = '+593 99 814 7056'

export const location = 'Quito, Ecuador'

// Only the two accounts that exist. `name` is what a screen reader announces;
// whatever renders these picks its own icon for it, so the list stays free of
// anything to do with how it looks.
export const socials = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/juan-diego-p%C3%A9rez-arias-697a1754/',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCUnv5Bm-HMRDcSBaeXeDhHA',
  },
]
