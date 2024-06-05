
import { writeFileSync, readFileSync } from 'fs';

const json = readFileSync('./users.json', "utf8");

const uniqueContacts = JSON.parse(json).reduce((acc, cur) =>
  acc.some(contact => contact.email === cur.email)
    ? acc
    : [...acc, cur], []).map(u => ({ name: u.name, email: u.email, date: u.date_created }))

writeFileSync('unique.json', JSON.stringify(uniqueContacts))
