import './header.css'
export default function Header() {
  return (
    <header>
      <h1>Six Degrees of F1 drivers</h1>
      <p className="subheader">Find the connections between any two drivers via shared teammates<sup>*</sup></p>
      <p className="details">For the purposes of this app, "teammates" means any two drivers who drove for the same constuctor in the same race, so while Ollie Bearman was Ferrari's backup driver in 2024, he counts as a former teammate of Charles Leclerc due to Bearman filling in for Carlos Sainz in Saudi Arabia that year. Also of note, prior to 1981 "same constructor" does not equal "same team," it just refers to two drivers who used the same chassis but may otherwise have zero affiliation with each other.</p>
    </header>
  )
}