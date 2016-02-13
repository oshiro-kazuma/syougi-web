package controllers

import play.api._
import play.api.mvc._

class Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def battle = Action {
    Ok(views.html.battle())
  }

  def history = Action {
    Ok(views.html.history())
  }

}
