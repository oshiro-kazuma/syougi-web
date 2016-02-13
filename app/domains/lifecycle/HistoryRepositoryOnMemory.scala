package domains.lifecycle

import java.util.UUID

import domains.models.{History, HistoryId}

import scala.collection.concurrent.TrieMap

class HistoryRepositoryOnMemory extends HistoryRepository {

  val storage: TrieMap[HistoryId, History] = new TrieMap[HistoryId, History]

  override def resolveAll(): Seq[History] = storage.values.toSeq

  override def resolveById(id: HistoryId): Option[History] = storage.get(id)

  override def store(history: History): Unit = {
    val entity: History = history.id.isDefined match {
      case true  => history
      case false => history.copy(id = HistoryId(UUID.randomUUID().toString))
    }
    storage.put(entity.id, entity)
  }

}