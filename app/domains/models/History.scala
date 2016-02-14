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
