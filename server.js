let http = require('http')
let xamel = require('xamel')
let xml = require('xamel/lib/xml')
let fetch = require('node-fetch')

let server = http.createServer((req, res) => {
    let rss = exports.youtube2rss(req.url.slice(1))
    if (!rss) {
        res.statusCode = 400
        res.end()
        return
    }

    let result
    my_fetch(rss).then( xml => {
        return exports.rss_enhance(xml)
    }).then( r => {
        result = r
    }).catch( err => {
        res.statusCode = 500
        result = err.toString()
    }).finally(() => {
        res.end(result)
    })
})

if (require.main === module) server.listen(process.env.PORT || 3000)


function mk_enclosure(href, parent) {
    return new xml.Tag('enclosure', {
        href,
        rel: "enclosure",
        type: "audio/mpeg"      // a dummy value
    }, parent)
}

exports.rss_enhance = function(text) {
    return new Promise( (resolve, reject) => {
        xamel.parse(text, (err, doc) => {
            if (err) { reject(err); return }

            // youtube feeds are atom feeds
            doc.find('feed/entry/link').children.forEach( kid => {
                kid.parent.append(mk_enclosure(kid.attrs.href, kid.parent))
            })

            resolve(xamel.serialize(doc))
        })
    })
}

/*
  Returns 1 of:

  https://www.youtube.com/feeds/videos.xml?channel_id=XXX
  https://www.youtube.com/feeds/videos.xml?user=XXX
  https://www.youtube.com/feeds/videos.xml?playlist_id=XXX
*/
exports.youtube2rss = function(youtube_url) {
    let url; try { url = new URL(youtube_url) } catch (_) { return null }

    let path = url.pathname.split('/').filter(Boolean)
    if (path[0] === 'user' && path[1])
        return `https://www.youtube.com/feeds/videos.xml?user=${path[1]}`
    if (path[0] === 'channel' && path[1])
        return `https://www.youtube.com/feeds/videos.xml?channel_id=${path[1]}`
    if (path[0] === 'playlist') {
        let sp = url.searchParams.get('list')
        if (sp)
            return `https://www.youtube.com/feeds/videos.xml?playlist_id=${sp}`
    }

    return null
}

function my_fetch(url, opt) {
    let fetcherr = r => {
        if (!r.ok) throw new Error(r.statusText)
        return r
    }
    return fetch(url, opt).then(fetcherr).then( r => r.text())
}
