export default function ColorRating(number) {
  const raiting = ['rating'];

  if (number < 3) {
    raiting.push('cirrcleColor1');
  } else if (number >= 3 && number < 5) {
    raiting.push('cirrcleColor2');
  } else if (number >= 5 && number < 7) {
    raiting.push('cirrcleColor3');
  } else {
    raiting.push('cirrcleColor4');
  }

  return raiting
}
