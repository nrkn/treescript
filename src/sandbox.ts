import { serialize, deserialize, t, wnode } from '.'
import { Wnode, WnodeAny, WnodeExtra } from './lib/wnode/types'

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

const roundTripped = deserialize(clubsData, value => {
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

  console.log(JSON.stringify(serialize(parent), null, 2))
}

{
  const a = wnode('a')
  const b = wnode('b')
  const c = wnode('c')

  a.appendChild(b)
  b.appendChild(c)

  console.log(serialize(a))

  a.appendChild(c)

  console.log(serialize(a))
}

{
  type InheritOptions<Deco extends {}> = {
    filter: (key: string, value: any, child: WnodeAny<Deco> ) => boolean
    deleteIf: (key: string, value: any, child: WnodeAny<Deco> ) => boolean
    mode: 'inherit' | 'overwrite'
  }

  const inheritValue = <Deco extends {}>(
    iterator: IterableIterator<WnodeAny<Deco>>,
    node: WnodeAny<Deco>,
    { filter, deleteIf, mode = 'inherit' } = {} as Partial<InheritOptions<Deco>>
  ) => {
    const computed = node.value

    if (computed === null || computed === undefined) return computed

    for (const child of iterator) {
      if (child === node) continue

      for (const key in child.value) {
        if (mode === 'inherit' && computed[key] !== undefined) continue

        const value = child.value[key]

        if (filter && !filter(key, value, child )) continue

        if( mode === 'overwrite' && deleteIf && deleteIf(key, value, child )) {
          delete computed[key]
          
          continue
        }         

        if (value === null || value === undefined) continue

        computed[key] = value
      }
    }

    return computed
  }

  const carnivora = t(
    { name: 'Carnivora', complete: false },
    t({ name: 'Caniformia', habitat: 'land' },
      t({ name: 'Canids' },
        t({ name: 'Dogs' }), t({ name: 'Wolves' }), t({ name: 'Foxes' })
      ),
      t({ name: 'Ursids', family: 'ursidae' },
        t({ name: 'Brown Bears' }), t({ name: 'Polar Bears' }),
        t({ name: 'Black Bears' }), t({ name: 'Pandas' }
        )
      ),
      t({ name: 'Mustelids' },
        t({ name: 'Weasels' }), t({ name: 'Otters' }), t({ name: 'Badgers' })
      )
    ),
    t({ name: 'Feliformia' },
      t({ name: 'Felids' },
        t({ name: 'Domestic Cats' }), t({ name: 'Lions' }),
        t({ name: 'Tigers' }), t({ name: 'Leopards' })
      ),
      t({ name: 'Hyenas' },
        t({ name: 'Spotted Hyenas' }), t({ name: 'Striped Hyenas' }),
        t({ name: 'Brown Hyenas' })
      ),
      t({ name: 'Mongooses' },
        t({ name: 'Meerkats' }), t({ name: 'Banded Mongooses' })
      )
    )
  )

  const ursids = carnivora.find(n => n.value.name === 'Ursids')!

  const pandaNote = { diet: 'herbivore', note: 'We know this one' }

  let pandas: Wnode<any, WnodeExtra>

  for (const bear of ursids.children) {
    console.log('adding todo metadata to', bear.value.name)

    const isPanda = bear.value.name === 'Pandas'

    if (isPanda) pandas = bear

    const additionalBearData = t(
      { type: 'metadata' },
      t({ key: 'weight', value: 0, note: 'Todo - update weight' }),
      t({ key: 'height', value: 0, note: 'Todo - update height' }),
      t(
        { key: 'diet', value: '', note: '' },
        isPanda ? pandaNote : { note: 'Todo - update diet' }
      )
    )

    bear.append(additionalBearData)
  }

  const fromUrsidDesc = inheritValue(ursids.descendants, ursids)
  const fromPandaAnc = inheritValue(pandas!.ancestors, pandas!)

  console.log('fromUrsidDesc', fromUrsidDesc)
  console.log('fromPandaAnc', fromPandaAnc)
}
