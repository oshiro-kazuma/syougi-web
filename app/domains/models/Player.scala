package domains.models

sealed trait Player { val value: Int; val name: String}
case object Black extends Player { val value = 1; val name = "先手"}
case object White extends Player { val value = 2; val name = "後手"}
case object Unknown extends Player { val value = 0; val name = "不明"}

object Player {
  def apply(value: Int) = value match {
    case 1 => Black
    case 2 => White
    case _ => Unknown
  }
}
