module Post exposing (BlogPost, BlogPostSet, emptySet, viewPosts, decoder)

import Json.Decode as D
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Keyed as Keyed
import Html.Lazy exposing (lazy)

type alias TextPostBody = {title : String, content : String}

type PostBody
    = TextPost TextPostBody

type alias BlogPost = {uuid : String, createdAt : Int, data : PostBody}

type alias BlogPostSet = {posts : List BlogPost, hasMore : Bool}

emptySet : BlogPostSet
emptySet = BlogPostSet [] True

viewPost : BlogPost -> Html msg
viewPost {data} =
    case data of
        TextPost p ->
            viewTextPost p

viewPosts : BlogPostSet -> Html msg
viewPosts {posts} =
    Keyed.node "div" [] (List.map viewKeyedPost posts)

viewKeyedPost : BlogPost -> (String, Html msg)
viewKeyedPost {uuid, data} =
    case data of
        TextPost p ->
            (uuid, lazy viewTextPost p)


viewTextPost : TextPostBody -> Html msg
viewTextPost post =
    div [class "post"]
        [ h1 [] [ text post.title]
        , text post.content
        ]

decoder : D.Decoder BlogPostSet
decoder =
    D.map2 BlogPostSet
        (D.field "posts" (D.list (D.oneOf [textDecoder])))
        (D.field "more" D.bool)

textDecoder : D.Decoder BlogPost
textDecoder =
    D.map3 BlogPost
        (D.map String.fromInt (D.field "postid" D.int))
        (D.field "createdat" D.int)
        (D.map TextPost (
            D.map2 TextPostBody
                (D.field "title" D.string)
                (D.field "contents" D.string)
            ) -- validate type is text
        )
