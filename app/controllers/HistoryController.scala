package controllers

import domains.lifecycle.HistoryRepository
import domains.models._
import org.joda.time.DateTime
import play.api.mvc._
import play.api.data.Form
import play.api.data.Forms._

import scalaz.Reader

class HistoryController extends Controller {

  val datetimeFormat = "yyyy-MM-dd HH:mm"

  def index = Action {
    val histories: Seq[History] = provider(History.resolveAll())
    Ok(views.html.history(histories))
  }

  def show(id: String) = Action {
    val histories: Seq[History] = provider(
      for {
        history <- History.resolve(HistoryId(id))
      } yield history.toSeq
    )
    Ok(views.html.history(histories))
  }

  def create = Action { implicit request =>
    historyCreateForm.bindFromRequest.fold(
      formWithErrors => BadRequest("error"),
      form => {
        provider(form.asEntity.store)
        Ok("ok")
      }
    )
  }

  private[this] def provider[A](reader: Reader[HistoryRepository, A]) = {
    reader(HistoryRepository.ofMemory )
  }

  private[this] case class HistoryCreateForm(time: DateTime, winner: Int) {
    def asEntity = History(id = EmptyHistoryId, time = time, winner = Player(winner))
  }

  private[this]  def historyCreateForm = Form {
    mapping(
      "time" -> jodaDate(datetimeFormat),
      "winner" -> number
    )(HistoryCreateForm.apply)(HistoryCreateForm.unapply)
  }

}
