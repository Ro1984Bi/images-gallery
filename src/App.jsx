import "./App.css";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const cdnUrl = 'https://urrsklmmmeccmlgvolif.supabase.co/storage/v1/object/public/images/'

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([])

  const getImage = async () => {
    const { data, error } = await supabase.storage.from('images').list(user?.id + '/', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc'}
    })
    if (data !== null) {
      setImages(data )
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImage()
    }
  }, [user])

  const magicLinkLogin = async () => {
    try {
      const result = await supabase.auth.signInWithOtp({
        email,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const uploadImage = async (e) => {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.id + "/" + v4(), file);

      if (data) {
        getImage()
      } else {
        console.log(error);
      }
  };

  const deleteImage = async (imageName) => {
    const { error } = await supabase.storage.from('images').remove([ user.id + '/' + imageName])
    
    if (error) {
      alert(error)
    } else {
      getImage()
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome to ImageGallery</h1>
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label>
                Enter an email to sign in with Supabase Magic Link
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => magicLinkLogin()}>
              Get Magic Link
            </Button>
          </Form>
        </>
      ) : (
        <>
          <h1>Your ImageGallery</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Currennt user: {user.email}</p>
          <p>Use Choose File button to upload images to your gallery</p>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => uploadImage(e)}
            />
          </Form.Group>
          <hr />
          <h3>Your Images</h3>
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={cdnUrl + user.id + '/' + image.name }>
                  <Card>
                    <Card.Img variant="top" src={cdnUrl + user.id + '/' + image.name } />
                    <Card.Body>
                      <Button variant="danger" onClick={() => deleteImage(image.name)}>Delete Image</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
