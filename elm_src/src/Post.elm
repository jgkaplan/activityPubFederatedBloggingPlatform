module Post exposing (BlogPost, viewPost, decoder)

import Json.Decode as D
import Html exposing (..)
import Html.Attributes exposing (..)

type alias TextPostBody = {title : String, content : String, uuid : Int}

type BlogPost
    = TextPost TextPostBody

viewPost : BlogPost -> Html msg
viewPost post =
    case post of
        TextPost p ->
            viewTextPost p


viewTextPost : TextPostBody -> Html msg
viewTextPost post =
    div [class "post"]
        [ h1 [] [ text post.title]
        , text post.content
        ]

decoder : D.Decoder (List BlogPost)
decoder =
    D.field "posts" (D.list (D.oneOf [textDecoder]))

textDecoder : D.Decoder BlogPost
textDecoder =
    D.map TextPost (
        D.map3 TextPostBody
            (D.field "title" D.string)
            (D.field "contents" D.string)
            (D.field "id" D.int)
        )
