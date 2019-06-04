module Dashboard exposing (..)

import Browser exposing (Document)
import Html exposing (..)
import Html.Events exposing (onClick)
import Post as P exposing (BlogPost, viewPost)
import Http

type alias Model = List BlogPost

type Msg
    = GetPosts
    | GotPosts (Result Http.Error (List BlogPost))

init : Model
init = []

getBlogPosts : Cmd Msg
getBlogPosts =
  Http.get
    { url = "http://localhost:3000/api/posts"
    , expect = Http.expectJson GotPosts P.decoder
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GetPosts ->
            (model, getBlogPosts)
        GotPosts result ->
            case result of
                Err error ->
                    ([], Cmd.none)
                Ok posts ->
                    (posts, Cmd.none)

view : Model -> Document Msg
view model =
    Document "Dashboard"
    [div [] (List.map viewPost model)
    , button [ onClick GetPosts ] [ text "Get Posts" ]
    ]
