package domains.support

trait Identifier[+A] {

  def value: A

  val isDefined: Boolean = true

  val isEmpty: Boolean = !isDefined

  override def equals(obj: Any) = obj match {
    case that: Identifier[_] =>
      value == that.value
    case _ => false
  }

  override def hashCode = 31 * value.##

}

object EmptyIdentifier extends EmptyIdentifier

trait EmptyIdentifier extends Identifier[Nothing] {

  def value: Nothing = throw new NoSuchElementException

  override val isDefined = false

  override def equals(obj: Any) = obj match {
    case that: EmptyIdentifier => this eq that
    case _ => false
  }

  override def hashCode = 0
}
