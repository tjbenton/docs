###
## @author Tyler Benton
## @page tests/rb-file
###

## @name One
## @description
## main method
for i in (1..4)
    print i," "
end
print "\n"


## @name Two
## @description
## This is a normal multi-line comment made of single line comments.
for i in (1...4)
  print i," "
end
print "\n"


## @name Three
## @description
## Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur
## mollitia voluptas obcaecati numquam voluptatibus ex, enim vero, nemo
## cupiditate architecto dolore ipsum dolores, amet at porro quis. Quis,
## voluptas consequuntur.
items = [ 'Mark', 12, 'goobers', 18.45 ]
for it in items
  print it, " "
end
print "\n"




# This shouldn't be parsed
for i in (0...items.length)
  print items[0..i].join(" "), "\n"
end
