package domains.lifecycle

import domains.models.{History, HistoryId}

class HistoryRepositoryOnJDBC extends HistoryRepository {

  override def resolveAll(): Seq[History] = ???

  override def resolveById(id: HistoryId): Option[History] = ???

  override def store(history: History): Unit = ???

}
