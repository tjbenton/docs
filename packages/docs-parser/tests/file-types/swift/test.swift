////
/// @author Tyler Benton
/// @page tests/swift-file
////

/// @name main
/// @description
/// main method
class Counter {
    var count = 0
    func increment() {
        ++count
    }
    func incrementBy(amount: Int) {
        count += amount
    }
    func reset() {
        count = 0
    }
}


/// @name Something
/// @description
/// This is a normal multi-line comment.
class Counter2 {
    var count: Int = 0
    func incrementBy(amount: Int, numberOfTimes: Int) {
        count += amount * numberOfTimes
    }
}


/// @name Something else
/// @description
/// This is another normal multi-line comment.
struct Point {
    var x = 0.0, y = 0.0
    func isToTheRightOfX(x: Double) -> Bool {
        return self.x > x
    }
}
let somePoint = Point(x: 4.0, y: 5.0)
if somePoint.isToTheRightOfX(1.0) {
    println("This point is to the right of the line where x == 1.0")
}

// This is a normal single-line comment.
