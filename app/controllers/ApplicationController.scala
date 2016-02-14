package controllers

import play.api._
import play.api.mvc._

class ApplicationController extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def battle = Action {
    Ok(views.html.battle())
  }

}
