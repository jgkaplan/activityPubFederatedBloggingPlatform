module Home exposing (..)

import Browser exposing (Document)
import Html exposing (..)
import Html.Events exposing (onClick)
import Route

type alias Model = ()

type Msg
    = NoOp

init : Model
init = ()

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        NoOp ->
            (model, Cmd.none)

view : Model -> Document Msg
view model =
    Document "Home"
    [div []
        [ h1 [] [text "Welcome to the ActivityPub Blogging Platform"]
        , ul []
            [ li [] [a [Route.href Route.Home] [text "Home"]]
            , li [] [a [Route.href Route.Dashboard] [text "Dashboard"]]
            ]
        ]
    ]
