package domains.lifecycle

import domains.models.{HistoryId, History}

trait HistoryRepository {

  def resolveAll(): Seq[History]

  def resolveById(id: HistoryId): Option[History]

  def store(history: History): Unit

}

object HistoryRepository {

  lazy val ofJDBC: HistoryRepository = new HistoryRepositoryOnJDBC

  lazy val ofMemory: HistoryRepository = new HistoryRepositoryOnMemory

}
