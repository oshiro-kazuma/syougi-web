package domains.models

import domains.lifecycle.HistoryRepository
import domains.support.{EmptyIdentifier, Identifier}
import org.joda.time._
import scalaz._
import Scalaz._

trait HistoryId extends Identifier[String]

object HistoryId {
  def apply(value: String) = ExistHistoryId(value)
}

case class ExistHistoryId(value: String) extends HistoryId

object EmptyHistoryId extends EmptyIdentifier with HistoryId

case class History(
  id: HistoryId,
  time: DateTime,
  winner: Player) {

  def store = History.store(this)

}

object History {

  def resolve(id: HistoryId): Reader[HistoryRepository, Option[History]] = Reader { repository =>
    repository.resolve(id)
  }

  def resolveAll(): Reader[HistoryRepository, Seq[History]] = Reader { repository =>
    repository.resolveAll()
  }

  def store(history: History): Reader[HistoryRepository, Unit] = Reader { repository =>
    repository.store(history)
  }

}
