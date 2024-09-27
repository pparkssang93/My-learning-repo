const str = "The quick brown fox jumps over the lazy dog.";

console.log(str.split("", 2));
// return [ 'T', 'h' ]

console.log(str.split("quick"));
// return [ 'The ', ' brown fox jumps over the lazy dog.' ]

console.log(str.split());
// return str이 그대로 배열에 담겨서 반환된다.

console.log(str.split("T"));
// return [ '', 'he quick brown fox jumps over the lazy dog.' ]
