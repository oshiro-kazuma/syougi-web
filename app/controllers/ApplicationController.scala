package controllers

import domains.lifecycle.HistoryRepository
import domains.models.History
import play.api._
import play.api.mvc._

import scalaz._
import Scalaz._

class ApplicationController extends Controller {

  def index = Action {
    val historyCount: Int = provider(History.countAll())

    Ok(views.html.index(historyCount))
  }

  def battle = Action {
    Ok(views.html.battle())
  }

  private[this] def provider[A](reader: Reader[HistoryRepository, A]) = {
    reader(HistoryRepository.ofMemory)
  }

}
