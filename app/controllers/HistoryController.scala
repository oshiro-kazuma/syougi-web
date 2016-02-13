package controllers

import domains.lifecycle.HistoryRepository
import domains.models._
import org.joda.time.DateTime
import play.api.mvc._
import play.api.data.Form
import play.api.data.Forms._

class HistoryController extends Controller {

  val datetimeFormat = "yyyy-MM-dd HH:mm"

  def index = Action {
    val histories: Seq[History] = HistoryRepository.ofMemory.resolveAll()
    Ok(views.html.history(histories))
  }

  def show(id: String) = Action {
    val histories: Seq[History] = HistoryRepository.ofMemory.resolveById(HistoryId(id)).toSeq
    Ok(views.html.history(histories))
  }

  def create = Action { implicit request =>
    historyCreateForm.bindFromRequest.fold(
      formWithErrors => BadRequest("error"),
      form => {
        HistoryRepository.ofMemory.store(form.asEntity)
        Ok("ok")
      }
    )
  }

  case class HistoryCreateForm(time: DateTime, winner: Int) {
    def asEntity = History(id = EmptyHistoryId, time = time, winner = Player(winner))
  }

  private def historyCreateForm = Form {
    mapping(
      "time" -> jodaDate(datetimeFormat),
      "winner" -> number
    )(HistoryCreateForm.apply)(HistoryCreateForm.unapply)
  }

}
