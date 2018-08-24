loops
=====

imperative loop
---------------

lets start from simple things. *loop* looks simple. at least it is much
simpler than `make`_ and it is really obvious that *js* is the most
complicated part here.

hopefuly its obvious what loop `is <goo.gl/nQ8i3s>`_ and what is
its `designation <https://goo.gl/wXLzaF>`_.

in other words loop is just abstraction which helps to perform actions
sequentially. action sequencer.

here is real world example: life is a loop. everybodies everyday life
is a fucking loop::

  var thoughts = null
  do {
    var mood = wakeUp(thoughts)
    thoughts = liveADay(mood)
  } while (thoughts !== null)

it is *optimistic*, isn't it? *pessimistic* loop on the other side
would look like::

  var thoughts
  do {
    var mood = sleep(thoughts)
    thoughts = liveADay(mood)
  } until (thoughts === null)

with some assumptions we may say that we have described a real life algorithm.
i don't think it's the real one. real should be much more simpler ;)

assumptions:

  1. there is a ``mood`` value for ``dead`` state
  2. ``liveADay("dead")`` is producing ``null``
  3. if ``dead`` state turns out during the day
     ``liveADay`` unconditionally and immediately
     returns ``null``

cps loop
--------

simple things appear in different form thanks to *js*::

  var repeat = () => wakeUp(
    mood => liveADay(
      mood,
      thoughts => sleep(
        thoughts,
        () => if (isAlive) {
          repeat()
        }
      )
    )
  )

jic, see `CPS <https://en.wikipedia.org/wiki/Continuation-passing_style>`.

i hope this code is pretty clear. but still, with the same assumptions it works
perfectly for us. the real question is, how to generalize it?

js
==

  i hereby vow that i have no commercial experience in *js* and i will do
  everything to avoid such experience because selling *js* code is like
  selling fresh made shit right from a paper used instead of a toilet.

  and i hereby vow to break previous vow because vows suck and life goes
  the way a life goes. *js* is not that shitty language as it may seem from
  a commercial shit-maker pov.

  and i hereby vow to hate till i die all the fucking ui-shit produced by
  yoogle, bittenberry and whathever microface or softbook they are.

yeah, *first* are good at search. more or less. they finally figured out that
search interface should be human-oriented, after they masturbated on
the most human-oriented interface widely spread for about 12 years (1998-2010)
they finally realized what the direction is. but inertia happens...

*second* did some good for handheld. i would prefer *berry* part, but
*bitten* freaks seems to win. to win mine, handhelds MUST project 3d
picture and allow to interact with it using at least hand-gestures.
hey, froogle guys, your handheld shit is

 * sliding out of hand
 * unusable with one arm in almost all cases
 * is fucking same all shit whatever idroid device you take in hand,

*last two* are fucking moron frankensteins. they resurrect the `Evil
<https://goo.gl/zuJVS4>`_ in a physical sh..shell. shell of shit.
shitty evil fills a shell of shit. tons of legacy shit blow their
shitty rays right into face...

and this freak-circus is dancing around *js* as the only saviour of
the universe. that made *js* the most powerful shit-magnet of all the
times.

*js* is good, but its raw. i mean it is raw as a pizza just taken out of
a freezer. no steaks are ever served that kind raw. luckily,
there is *typescript* (which, surprisingly, was born somewhere in the
mind of moron frankenstein), *react* (surprisingly, born in the mind of
another moron frankenstein) and tons of other kind of shit which makes
life generally a littble bit easier. 

a kind of a weird tendency, i'd said.

that said, i mean to use the following betteries for js:
 * `typescript <http://www.typescriptlang.org/>`
   programming languages exist for a long time. typed, untyped, duck-
   taped and even raped. general rule is: strictier languages
   typesystem, the easier to understand what's going on in this shit.
 * `react <https://reactjs.org/>`
   as i read somewhere the concept of embedding code into 
 * and possibly some more

and finally lets continue to *make* part...

make
====

*js* has single-threaded programming model it does not have any
synchronization or thread primitives.

instead, *js* programming model proposes to use `CPS
<https://en.wikipedia.org/wiki/Continuation-passing_style>`_.

so here are the building blocks

1. infinite loop function

::

  let repeat = (state: T, action: T => T) => repeat(action(state), action)

2. to *make* it finite, condition is added

::

  let repeat = (state: T, action: T => T, condition: T => boolean) =>
    if (condition(state)) {
      repeat(action(state), action, condition, continuation)k
    }

3. ``continuation`` *makes* it even more flexible

::

  let repeat = (state        : T,
                action       : T => T,
                condition    : T => boolean,
                continuation : T => void) =>
    if (condition(state)) {
      repeat(action(state), action, condition, continuation)
    } else {
      continuation(state)
    }

4. ``action``, ``condition`` and ``continuation`` are constants

::

  let repeat = (initialState : T,
                action       : T => T,
                condition    : T => boolean,
                continuation : T => void) =>
    let iteration = (state : T) =>
      if (condition(state) {
        iteration(action(state))
      } else {
        continuation(state)
      }
    iteration(initialState)

5. that was ``while`` loop, ``until`` loop can be simply expressed as

::

  let until = (initialState : T,
               action       : T => T,
               condition    : T => boolean,
               continuation : T => void) =>
    repeat(initialState, action, t => !condition(t). continuation)

6. and the post-conditioned loop configuration like in examples from above

::

  let repeat = (initialState : T,
                action       : T => T,
                condition    : T => boolean,
                continuation : T => void) =>
    if(condition(state = action(state))) {
      iteration(state)
    } else {
      continuation(state)
    }

use cases
---------

process
~~~~~~~

::

  let processContentOfEachFile = (files: Array<string>) => 
    fetch(files.pop())
      .then(fileText => {
        process(fileText)
        fetchAll(files)
      })
      .catch(alert)

collect
~~~~~~~

::

  let collectToArray = (files        : Array<string>,
                        continuation : Array<string> => void) => {
    let array = new Array<string>();
    let iteration
    fetch(files.pop()))
      .then(fileText => {
        array.push(fileText);
        if (files.length > 0) {
        } else {
          continuation(array);
        }
      }
  }