loops
=====

imperative loop
---------------

lets start from simple things. *loop* looks simple. at least it is much
simpler than `make`_ and it is really obvious than `js`_ is the most
complicated part here.

hopefuly its obvious what loop `is <https://goo.gl/nQ8i3s>`_ and what is
its `designation <https://goo.gl/wXLzaF>`_.

in other words loop is just abstraction which helps to perform actions
sequentially. action sequencer.

here is real world example: life is a loop. everybodies everyday life
is a fucking loop:

.. code-block:: javascript

  var thoughts = null
  do {
    var mood = sleep(thoughts)
    thoughts = liveADay(mood)
  } while (thoughts !== null)

it is *optimistic*, isn't it? *pessimistic* loop on the other side
would look like:

.. code-block:: javascript

  var thoughts
  do {
    var mood = sleep(thoughts)
    thoughts = liveADay(mood)
  } until (thoughts === null)

with some assumptions we may say that we have described a real life algorithm.
i don't think it's the real one. real should be much more simpler ;)

assumptions:

  1. if death happens during a sleep
     ``sleep`` unconditionally and immediately
     returns ``null``
  2. ``liveADay(null)`` always produces ``null``
  3. if death happens during a day
     ``liveADay`` unconditionally and immediately
     returns ``null``

cps loop
--------

simple things appear in different form thanks to *js*:

.. code-block:: javascript

  var repeat = ( thoughts ) =>
               sleep(
                 mood =>
                   liveADay(
                     mood,
                     thoughts =>
                       thoughts !== null
                         ? repeat(thoughts)
                         : null
                   )
               )

jic, see `CPS <https://en.wikipedia.org/wiki/Continuation-passing_style>`_.

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

yeah, *first* are good at search. more or less. less or more. more less or
more, than more or less, actually. so those who more finally figured out
that search interface should be human-oriented, after they masturbated on
the most human-oriented interface widely spread for about 12 years (1998-
2010) they finally realized what the direction is. but inertia happens...

*second* did some good for handheld. i would prefer *berry* part, but
*bitten* freaks seems to win. to win mine, handhelds MUST project 3d
picture and allow to interact with it using at least hand-gestures.
hey, froogle guys, your handheld shit is

 * sliding out of hand
 * unusable with one arm in almost all cases
 * is fucking same all shit whatever idroid device is in hand,

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
life generally a little bit easier.

a kind of a weird tendency, i'd said.

that said, i mean to use the following betteries for js (where applicable):
 * `typescript <http://www.typescriptlang.org/>`_
      programming languages exist for a long time. typed, untyped, duck-
      taped... general rule is: strictier languages typesystem is,
      easier to understand what's going on in this shit.

 * `react <https://reactjs.org/>`_
      somewhere i've just caught the thought that it's illegal to embed
      c into assembler, that way react+jsx just makes a good jump to
      right direction

make
====

*js* has single-threaded programming model it does not have any
synchronization or thread primitives.

instead, *js* programming model proposes to use `CPS
<https://en.wikipedia.org/wiki/Continuation-passing_style>`_.

so here are the building blocks

1. start with infinite loop function

.. code-block:: typescript

  let repeat = < T >
               (state  : T,
                action : T => T
               ) =>
               repeat(action(state), action)

2. to *make* it finite, add a condition

.. code-block:: typescript

  let repeat = < T >
               ( state     : T,
                 action    : T => T,
                 condition : T => boolean
               ) =>
               { if (condition(state)) {
                   repeat(action(state), action, condition, continuation)k
                 }
               }

3. ``continuation`` *makes* it even more flexible

.. code-block:: typescript

   let repeat = < T >
                ( state        : T,
                  action       : (_ : T) => T,
                  condition    : (_ : T) => boolean,
                  continuation : (_ : T) => void
                ) =>
                condition(state = action(state))
                  ? repeat(state, action, condition, continuation)
                  : continuation(state)


4. ``action``, ``condition`` and ``continuation`` are constants

.. code-block:: typescript

  let repeat = < T >
               ( initialState : T,
                 action       : (_ : T) => T,
                 condition    : (_ : T) => boolean,
                 continuation : (_ : T) => void
               ) =>
               { let iteration = ( state : T ) =>
                                 condition(state = action(state))
                                   ? iteration(state)
                                   : continuation(state)
                 iteration(initialState)
               }

5. that was ``while`` loop, ``until`` loop can be simply expressed as

.. code-block:: typescript

  let until = < T >
              ( initialState : T,
                action       : (_ : T) => T,
                condition    : (_ : T) => boolean,
                continuation : (_ : T) => void
              ) =>
              repeat(initialState, action, t => !condition(t), continuation)

6. and the post-conditioned loop configuration like in examples from above

.. code-block:: typescript

  let repeat = < T >
               ( initialState : T,
                 action       : (_ : T) => T,
                 condition    : (_ : T) => boolean,
                 continuation : (_ : T) => void
               ) =>
               condition(state = action(state))
                 ? iteration(state)
                 : continuation(state)

use cases
---------

process
~~~~~~~

.. code-block:: typescript

  let processFiles = ( files: Array<string> ) =>
                     fetch(files.pop())
                       .then(
                         ( response : Response
                         ) =>
                         response.text()
                           .then(
                             ( fileText : string
                             ) =>
                             { process(fileText)
                               processFiles(files)
                             }
                           )
                           .catch(alert)
                       )
                       .catch(alert)



collect
~~~~~~~

.. code-block:: typescript

  let collectToArray = ( files : Array<string>,
                         continuation : (_ : Array<string>) => void
                       ) =>
                       { let array = new Array<string>()
                         let iteration = () =>
                                         fetch(files.pop())
                                           .then(
                                             ( response : Response
                                             ) =>
                                             response.text()
                                               .then(
                                                 ( fileText : string
                                                 ) =>
                                                 { array.push(fileText)
                                                   if (files.length > 0) {
                                                     iteration()
                                                   } else {
                                                     continuation(array)
                                                   }
                                                 }
                                               )
                                               .catch(alert)

non use cases
-------------

any regular loop
~~~~~~~~~~~~~~~~

one must be an idiot to use CPS for any loops in *js* which may
be expressed using ``for``, ``in``, ``of``, ``while`` and ``do``
keywords.

any infinite loop
~~~~~~~~~~~~~~~~~

infinite cps loops being recursive are prohibited `by the obvious reason
<https://kangax.github.io/compat-table/es6/#test-proper_tail_calls_(tail_call_optimisation)>`_.
on almost all *js* implementations.
