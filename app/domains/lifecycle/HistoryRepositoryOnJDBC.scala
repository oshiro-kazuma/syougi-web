package domains.lifecycle

import domains.models.{History, HistoryId}

// todo: Not implements. Please using of memory repository.
class HistoryRepositoryOnJDBC extends HistoryRepository {

  override def resolveAll(): Seq[History] = ???

  override def resolveById(id: HistoryId): Option[History] = ???

  override def store(history: History): Unit = ???

}
