port module Main exposing (..)

import Browser exposing (Document, document)
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Lazy exposing (lazy)
import Http
import Url exposing (Url)
import Json.Decode as D
import Browser.Dom as Dom
import Task
--Page imports
import Home
import Dashboard
import NotFound
--Data imports
import Post as P exposing (BlogPost)
import Route

main =
  Browser.application
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    , onUrlRequest = ClickedLink
    , onUrlChange = ChangedUrl
    }

-- MODEL

type alias Model =
    { key : Nav.Key
    , page : PageModel
    }

--PageModel is a type wrapping the models of each page
type PageModel
    = NotFound
    | Loading --for initial load
    | Home Home.Model
    | Dashboard Dashboard.Model

type Msg
    = ChangedRoute (Maybe Route.Route)
    | ChangedUrl Url
    | ClickedLink Browser.UrlRequest
    | GotHomeMessage Home.Msg
    | GotDashboardMessage Dashboard.Msg
    | GotNotFoundMessage NotFound.Msg
    | NoOp

init : () -> Url -> Nav.Key -> (Model, Cmd Msg)
init _ url navKey =
    changeRouteTo (Route.fromUrl url)
    (Model navKey Loading)

-- type Result error value = Ok value | Err error


-- UPDATE

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    let {key, page} = model
    in case ( msg, page ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    case url.fragment of
                        Nothing ->
                            -- If we got a link that didn't include a fragment,
                            -- it's from one of those (href "") attributes that
                            -- we have to include to make the RealWorld CSS work.
                            --
                            -- In an application doing path routing instead of
                            -- fragment-based routing, this entire
                            -- `case url.fragment of` expression this comment
                            -- is inside would be unnecessary.
                            ( model, Cmd.none )

                        Just _ ->
                            ( model
                            , Nav.pushUrl key (Url.toString url)
                            )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (Route.fromUrl url) model

        ( ChangedRoute route, _ ) ->
            changeRouteTo route model

        ( GotHomeMessage message, Home m) ->
            Home.update message m
            |> updateWith Home GotHomeMessage key page

        ( GotDashboardMessage message, Dashboard m) ->
            Dashboard.update message m
            |> updateWith Dashboard GotDashboardMessage key page

        ( _, _ ) ->
            -- Disregard messages that arrived for the wrong page.
            ( model, Cmd.none )

updateWith : (subModel -> PageModel) -> (subMsg -> Msg) -> Nav.Key -> PageModel -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg key model ( subModel, subCmd ) =
    ( Model key (toModel subModel)
    , Cmd.map toMsg subCmd
    )

-- let _ = Debug.log "error" error

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions {page} =
  case page of
      NotFound -> Sub.none
      Loading -> Sub.none
      Home _ -> Sub.none
      Dashboard dash -> Sub.map GotDashboardMessage (Dashboard.subscriptions dash)

-- VIEW

view : Model -> Document Msg
view {key,page} =
    let viewPage {title, body} toMsg =
            { title = title
            , body = List.map (Html.map toMsg) body
            }
    in case page of
        NotFound -> viewPage (NotFound.view) GotNotFoundMessage
        Loading ->
            { title = "Loading"
            , body = [text "Loading"]
            }
        Home m -> viewPage (Home.view m) GotHomeMessage

        Dashboard m -> viewPage (Dashboard.view m) GotDashboardMessage
{--
        |> andThen (\str ->
           case str of
                "Text" ->
                    Decode.succeed Text
                somethingElse ->
                    Decode.fail <| "Unknown post type: " ++ somethingElse
        )
--}

resetViewport : Cmd Msg
resetViewport =
  Task.perform (\_ -> NoOp) (Dom.setViewport 0 0)

changeRouteTo : Maybe Route.Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    let {key, page} = model
    in case maybeRoute of
        Nothing ->
            ( Model key NotFound, Cmd.none )

        Just Route.Home ->
            Home.init
                |> updateWith Home GotHomeMessage key page

        Just Route.Dashboard ->
            Dashboard.init
                |> updateWith Dashboard GotDashboardMessage key page
