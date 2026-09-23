import './App.css';
import drivers from '@data/drivers.json';
import Header from './components/Header/Header';
import Main from './components/Main/Main';

console.log(
  "%c Repo: http://github.com/kevinnewcombe/six-degrees-of-f1/",
  `padding:21px 5px 20px 35px; display: inline-block; font-family: monospace; background:url(data:image/gif;base64,R0lGODlhHgAeANMAAAAA4AAoKHgAAKAAAChISPgAAEhoaACA+P8A/6h4WNiYIOCoiMjo6Pj4+AAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/sJodHRwOi8vd3d3LnJ0bHNvZnQuY29tL2FuaW1hZ2ljLwoKQ3JlYXRlZCB3aXRoIEFuaW1hZ2ljIEdJRiBWIDEuMjJhCmJ5IFJpZ2h0IHRvIExlZnQgU29mdHdhcmUgSW5jLgoKVG8gc3VwcHJlc3MgdGhpcyBtZXNzYWdlIGluIHRoZSByZWdpc3RlcmVkIHZlcnNpb24KdW5jaGVjayAiT3B0aW9ucyB8IEFuaW1hZ2ljIGNvbW1lbnQgZnJhbWUiCgAh+QQJHgAIACwAAAAAHgAeAAAE/xDJSWW4uOpNbylN811caX1gKI7mFnwDhg1sO71FjKIBXQS2k07m6f2CiN4rEFosQsuYTfZ7BpzMxTJTITEZMiu2ocUwGkBvA/y9XrVOrDxwvtST67A7kOgnLnAydxZMeQllRBgLf2doQDdsbIcXApUCgH90do8WDGCSWDtvmZ9gXWxKfIhXmTGbLj45B3x+fQEHsVKwPgMHs0S+vLouPTEAADsfx8UkLcUhPxgpA8M2MZ6p12ADJom3FwcAFwC/v0Q3BunptwAK7uIB7e+z6usWBPj48QqWChf8lRSIy6ePEBEAlipRSgjvXJIABOMlvBRg4sB8zS7Us+MJG52ObCg2ProQcQCDhAsrMYgRkVOiAmAspaQTTUaHc8lyFnho82ZGbz17IogAACH5BAkeAAgALAAAAAAeAB4AAAT9EMlJZ7ih6q1v+cXFjVYAnmFGdufQNMOprpJZDPj74nFI1zeMEBObrQIDGwqENJIuyaEw+gssMIuG9dq4Xq7HhXirHXevYvAokBiLX+/zNuHsJNru9HZxr2++GHd9gH4cbF5SfIVrd4hWfT8UJgdsgn0HPpE2B5RDnB+LFSYuLyc6RZoDDDpCOgxJkQgXDAxNTbQia0KynQBCvgGUsrs1BsbGwQAKy8DKzJTHyDUE1NQBygLZChcK2QIKvtXWNVIA3tkX5wLAQ+Ti1+rp5+HVuRfRs7S4Afr7+CoX3qk6Jy/bqwDvZkgpUMtbQX4piJHbtWTJMIkTAUppd3FGBAA7)no-repeat 5px center`,
);

function App() {
  return (
    <div className={`app`} >
      {!drivers.length ?
        <p className="error">There was an error getting the list of drivers.</p> :
        <>
          <Header />
          <Main drivers={drivers} />
        </>}
    </div>
  );
}

export default App;