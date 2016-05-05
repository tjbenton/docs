###
## @author Tyler Benton
## @page tests/coffee-file
###


## @name One
## @description
## main method
outer = 1
changeNumbers = ->
  inner = -1
  outer = 10
inner = changeNumbers()


## @name Two
## @description
## This is a normal multi-line comment.
mood = greatlyImproved if singing

if happy and knowsIt
  clapsHands()
  chaChaCha()
else
  showIt()

date = if friday then sue else jill


## @name Three
## @description
## This is another normla multi-line comment.
yearsOld = max: 10, ida: 9, tim: 11

ages = for child, age of yearsOld
  "#{child} is #{age}"

# This a normal single-line comment.
