export type FontWeight = 'regular' | 'medium' | 'bold' ;

export type FontMap = {
  [key in FontWeight]: string;
}