package domains.models

import domains.support.{EmptyIdentifier, Identifier}
import org.joda.time._
import scalaz.Scalaz._

trait HistoryId extends Identifier[String]

object HistoryId {
  def apply(value: String) = ExistHistoryId(value)
}

case class ExistHistoryId(value: String) extends HistoryId

object EmptyHistoryId extends EmptyIdentifier with HistoryId

case class History(
  id: HistoryId,
  time: DateTime,
  winner: Player
)

sealed trait Player { val value: Int}
case object Black extends Player { val value = 1 }
case object White extends Player { val value = 2 }
case object Unknown extends Player { val value = 0 }

object Player {
  def apply(value: Int) = value match {
    case 1 => Black
    case 2 => White
    case _ => Unknown
  }
}
