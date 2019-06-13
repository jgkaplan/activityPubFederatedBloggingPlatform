port module Dashboard exposing (..)

import Browser exposing (Document)
import Html exposing (..)
import Html.Events exposing (onClick)
import Post as P exposing (BlogPost, BlogPostSet, viewPosts)
import Http
import Browser.Dom as Dom
import Task
import Json.Encode as E
import Json.Decode as D

type alias Model = BlogPostSet

type Msg
    = GetPosts E.Value
    | GotPosts (Result Http.Error BlogPostSet)

init : (Model, Cmd Msg)
init = (P.emptySet, getBlogPosts Nothing)

getBlogPosts : Maybe String -> Cmd Msg
getBlogPosts result =
    case result of
        Just lastPostTime ->
            Http.request { method = "GET"
                , headers = [Http.header "lastPostTime" lastPostTime]
                , url = "http://localhost:3000/api/posts"
                , body = Http.emptyBody
                , expect = Http.expectJson GotPosts P.decoder
                , timeout = Just 10000
                , tracker = Nothing
                }
            -- Http.get
            --     { url = "http://localhost:3000/api/posts?lastPostId="++lastPostId
            --     , expect = Http.expectJson GotPosts P.decoder
            --     }
        Nothing ->
            Http.get
                { url = "http://localhost:3000/api/posts"
                , expect = Http.expectJson GotPosts P.decoder
                }

-- hasReachedBottom
--     = Task.perform (\{scene, viewport} -> if viewport.y + viewport.height >= scene.height then getBlogPosts else Cmd.none) Dom.getViewPort

port hasReachedBottom : (E.Value -> msg) -> Sub msg

port scrollProcessed : E.Value -> Cmd msg

lastId : List BlogPost -> E.Value
lastId posts = case posts of
    [] -> E.null
    p::[] -> E.string (p.uuid)
    x::xs -> lastId xs

subscriptions : Model -> Sub Msg
subscriptions _ =
    hasReachedBottom GetPosts

decodeValue : E.Value -> Maybe String
decodeValue val = case D.decodeValue D.string val of
    Err _ -> Nothing
    Ok s -> Just s

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GetPosts lastPostTime ->
            (model, getBlogPosts (decodeValue lastPostTime))
        GotPosts result ->
            case result of
                Err error ->
                    ( model
                    , scrollProcessed
                        ( E.object
                            [ ("lastPostId", E.null)
                            , ("more", E.bool model.hasMore)
                            , ("error", E.string "Failed to get posts")
                            ]
                        )
                    )
                Ok {posts, hasMore} ->
                    ( {posts = model.posts ++ posts, hasMore = hasMore}
                    , scrollProcessed
                        ( E.object
                            [ ("lastPostId", lastId posts)
                            , ("more", E.bool hasMore)
                            , ("error", E.null)
                            ]
                        )
                    )



view : Model -> Document Msg
view model =
    Document "Dashboard"
    [ viewPosts model
    --, button [ onClick (GetPosts Nothing)] [ text "Get Posts" ]
    ]
