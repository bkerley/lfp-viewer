# lfp-viewer

`lfp-viewer` decodes Lytro LFP files in JavaScript, 
suitable for use in a web browser.

*This project is not affiliated with Lytro, 
or any of the current holders of Lytro assets.*

## Lytro? LFP File?

[Lytro][lytro-wp] was a company that made weird "light-field"
cameras for consumer use. 
Their big thing is that they don't capture a single image plane,
but also some information about the directionality of light
to allow some refocusing based solely on captured data.
How much refocusing? 
See <https://bkerley.github.io/lfp-viewer/> (scroll down)

As far as I know, they released an original rectangular prism-shaped camera,
a much larger "Illum" one shaped like a more traditional camera,
started work on a bigger camera, and then shut down forever.

[lytro-wp]: https://en.wikipedia.org/wiki/Lytro

My Illum shoots two kinds of file by default:

* a `.LFR` file that's over 50mb and presumably contains the raw sensor
    data, 
    intended  for further processing or archiving

* a `.LFP` file that's under 1mb and contains ten JPEGs and some other
    metadata,
    which was seemingly intended for sharing

This project decodes the `.LFP` files, because it's easy :P

## Just Looking

Check out <https://bkerley.github.io/lfp-viewer/> ,
or `index.html` in this directory.

## I want this on my own web page

Download the `lfp-viewer.js` file from
<https://bkerley.github.io/lfp-viewer/>
and put it in a `script` tag; at the very bottom of the page works fine.

Right now it looks for any instances of HTML elements like
`<lfp-debug src="demo/demo.LFP"></lfp-debug>`,
replaces them with a `<lfp-debug-info>` element full of info, 
including image blobs waaaayyyy at the bottom.

## I want to hack on this

Cool!

This project uses TypeScript,
which means you're gonna have to deal with getting these installed:

1. `node` and `npm` (pretty sure i just did `brew install npm`)
2. dependencies (`npm install` from the project root)

Once you've got that up and running, 
I tend to keep
`npx run dev-server` going while I'm typing, 
and just mash reload in the web browser to see changes.

## Things I'd like to do

- [x] actually successfully decode images from a file
- [ ] make a `lfp-viewer` tag that doesn't do all the debug info
- [ ] write a script to animate `lfp-viewer` stuff?
- [ ] `Dockerfile` for dev work

## References and Resources

I found these references useful. 
Their authors aren't affiliated with this project.

[Lytro Meltdown](http://optics.miloush.net/lytro/)
by Jan Kučera was a great read to help me get this project going.
The "File Format" page especially!

[lfptools](https://github.com/syoyo/lfptools)
by Syoyo Fujita was really useful to help me understand this
was a possible and easy thing to do.
Running a simple C program and watching JPEGs fall out was
awesome.

[Reverse Engineering the Lytro LFP File Format](https://eclecti.cc/computervision/reverse-engineering-the-lytro-lfp-file-format)
by Nirav Patel is inspiring too, 
and may be useful for a future phase of this project???

## Contact

Bryce Kerley

Email: <mailto:bkerley@brycekerley.net>

Mastodon: <https://m.bonzoesc.net/@bonzoesc>
