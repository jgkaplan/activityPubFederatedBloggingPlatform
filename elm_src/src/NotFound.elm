module NotFound exposing (..)

import Browser exposing (Document)
import Html exposing (..)
import Html.Events exposing (onClick)
import Route

type Msg
    = NoOp

view : Document msg
view =
    Document "Not Found"
    [div []
        [ h1 [] [text "404: This page could not be found"]
        , a [Route.href Route.Home] [text "Home"]
        , a [Route.href Route.Dashboard] [text "Dashboard"]
        ]
    ]
