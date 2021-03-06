module Route exposing (Route(..), fromUrl, href, replaceUrl, pushUrl)

import Html exposing (Attribute)
import Html.Attributes as Attr
import Browser.Navigation as Nav
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string)

type Route
    = Home
    | Dashboard
    -- | Root
    -- | Login
    -- | Logout
    -- | Register
    -- | Settings
    -- | Article Slug
    -- | Profile Username
    -- | NewArticle
    -- | EditArticle Slug

parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Dashboard (s "dashboard")
        -- , Parser.map Logout (s "logout")
        -- , Parser.map Settings (s "settings")
        -- , Parser.map Profile (s "profile" </> Username.urlParser)
        -- , Parser.map Register (s "register")
        -- , Parser.map Article (s "article" </> Slug.urlParser)
        -- , Parser.map NewArticle (s "editor")
        -- , Parser.map EditArticle (s "editor" </> Slug.urlParser)
        ]


href : Route -> Attribute msg
href targetRoute =
    Attr.href (routeToString targetRoute)


pushUrl : Nav.Key -> Route -> Cmd msg
pushUrl key route =
    Nav.pushUrl key (routeToString route)

replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)


fromUrl : Url -> Maybe Route
fromUrl url =
    -- The RealWorld spec treats the fragment like a path.
    -- This makes it *literally* the path, so we can proceed
    -- with parsing as if it had been a normal path all along.
    { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
    -- url
        |> Parser.parse parser



-- INTERNAL


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                Home ->
                    []

                Dashboard ->
                    ["dashboard"]
                -- Login ->
                --     [ "login" ]
                --
                -- Logout ->
                --     [ "logout" ]
                --
                -- Register ->
                --     [ "register" ]
                --
                -- Settings ->
                --     [ "settings" ]
                --
                -- Article slug ->
                --     [ "article", Slug.toString slug ]
                --
                -- Profile username ->
                --     [ "profile", Username.toString username ]
                --
                -- NewArticle ->
                --     [ "editor" ]
                --
                -- EditArticle slug ->
                --     [ "editor", Slug.toString slug ]
    in
    -- String.join "/" pieces
    "#/" ++ String.join "/" pieces
