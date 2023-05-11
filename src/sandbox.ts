import { serialize, deserialize, t, wnode } from '.'

const clubs = t(
  { type: 'clubs' },
  t(
    { type: 'club', name: 'star gazers' },
    t('alex sun'),
    t('nick moon')
  ),
  t(
    { type: 'club', name: 'wildlife watchers' },
    t('quinn bird'),
    t('blake bear')
  )
)

const clubsData = serialize(clubs, value => {
  if (typeof value === 'string') {
    return { type: 'person', name: value }
  }

  return value
})

console.log(JSON.stringify(clubsData, null, 2))

const roundTripped = deserialize()(clubsData, value => {
  if (value.type === 'person') {
    return value.name
  }

  return value
})

console.log(JSON.stringify(serialize(roundTripped), null, 2))

{
  
  const parent = wnode('parent')
  const a = wnode('a')
  const aa = wnode('aa')
  const b = wnode('b')

  parent.appendChild(a)
  a.appendChild(aa)
  parent.insertBefore(b, null)

  console.log(b === aa.following())

  console.log( JSON.stringify(serialize(parent), null, 2))
}