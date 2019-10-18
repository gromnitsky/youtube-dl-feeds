#!/opt/bin/mocha --ui=tdd
'use strict';

let server = require('../server')
let fs = require('fs')
let assert = require('assert')
let xamel = require('xamel')

function xml_find(text, exp) {
    return new Promise( (resolve, reject) => {
        xamel.parse(text, (err, doc) => {
            if (err) { reject(err); return }
            resolve(doc.find(exp))
        })
    })
}

suite('xml', function() {
    test('rss_enhance', async function() {
        let xml = await server.rss_enhance(fs.readFileSync(__dirname + '/computer-history-museum-oral-history.xml').toString())
        let enclosures = (await xml_find(xml, 'feed/entry/link')).children
            .filter(tag => tag.attrs.rel === 'enclosure')
//        console.log(enclosures)
        assert.equal(enclosures.length, 15)
    })
})

suite('rss', function() {
    test('youtube2rss', function() {
        assert.equal(server.youtube2rss('omglol'), null)

        assert.equal(server.youtube2rss('https://www.youtube.com/user/StonedMeadowOfDoom93/featured'), 'https://www.youtube.com/feeds/videos.xml?user=StonedMeadowOfDoom93')
        assert.equal(server.youtube2rss('https://www.youtube.com/user/'), null)

        assert.equal(server.youtube2rss('https://www.youtube.com/channel/UCkfcCDelDAvxVBTplofk6OQ'), 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkfcCDelDAvxVBTplofk6OQ')
        assert.equal(server.youtube2rss('https://www.youtube.com/channel/'), null)

        assert.equal(server.youtube2rss('https://www.youtube.com/playlist?list=PLIqbhl7LJC7KzVPXzcb984OkMBttg-yv3'), 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLIqbhl7LJC7KzVPXzcb984OkMBttg-yv3')
        assert.equal(server.youtube2rss('https://www.youtube.com/playlist?omglol=PLIqbhl7LJC7KzVPXzcb984OkMBttg-yv3'), null)
    })
})
