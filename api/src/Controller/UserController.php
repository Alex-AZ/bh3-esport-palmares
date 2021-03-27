<?php

namespace App\Controller;

use App\Entity\Role;
use App\Entity\User;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController extends AbstractController
{
    /**
     * @Route("/api/users", name="get_users", methods={"GET"})
     *
     * @return Response
     */
    public function getUsersAction(): Response
    {
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository(User::class)->findBy([], ['position' => 'ASC']);

        $response = new Response($this->get('serializer')->serialize($users, 'json', ['groups' => ['user']]));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/users/connected-user/{id}/{token}", name="get_connected_user", methods={"GET"})
     *
     * @param $id
     * @param $token
     * @return Response
     */
    public function getConnectedUserAction($id, $token): Response
    {
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository(User::class)->findOneBy(['id' => $id, 'token' => $token]);

        $response = new Response($this->get('serializer')->serialize($users, 'json', ['groups' => ['connectedUser', 'user']]));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/users", name="add_user", methods={"POST"})
     *
     * @param Request $request
     * @param \Swift_Mailer $mailer
     * @param ValidatorInterface $validator
     * @return Response
     * @throws Exception
     */
    public function addUserAction(Request $request, \Swift_Mailer $mailer, ValidatorInterface $validator): Response
    {
        if (!$this->allowAccess($request->headers->get('authorization'), ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $user = $this->get('serializer')->deserialize($request->getContent(), User::class, 'json');

        $em = $this->getDoctrine()->getManager();

        if (!$user->getPosition()) {
            $user->setPosition(count($em->getRepository(User::class)->findAll()) + 1);
        }

        $user->setToken(hash('md5', uniqid('bh3', true).$user->getUsername()));

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            throw new Exception($errors[0]->getMessage());
        }

        $em->persist($user);
        $em->flush();

        $message = (new \Swift_Message('BH3-Esport - Activation de votre compte'))
            ->setFrom('contact@bh3-esport.fr')
            ->setTo($user->getEmail())
            ->setBody(
                $this->renderView('emails/user-activation.html.twig', ['user' => $user]),
                'text/html'
            )
        ;

        $mailer->send($message);

        $response = new Response($this->get('serializer')->serialize($user, 'json', ['groups' => ['user']]), Response::HTTP_CREATED);
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/users/{id}", name="edit_user", methods={"PATCH"})
     *
     * @param int $id
     * @param Request $request
     * @param Filesystem $filesystem
     * @param ValidatorInterface $validator
     * @return Response
     * @throws Exception
     */
    public function editUserAction(int $id, Request $request, Filesystem $filesystem, ValidatorInterface $validator): Response
    {
        if (!$this->allowAccess($request->headers->get('authorization'), ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->find($id);

        $requestContent = json_decode($request->getContent());

        $this->get('serializer')->deserialize($request->getContent(), User::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $user]);

        $user->cleanRoles();
        foreach ($requestContent->roles as $role) {
            $user->addRole($em->getRepository(Role::class)->find($role->id));
        }

        if (isset($requestContent->pictureFile)) {
            $pictureData = base64_decode(explode(',', $requestContent->pictureData)[1]);
            $pictureName = md5($user->getUsername()).$requestContent->pictureExtension;

            $filesystem->dumpFile('img/users/'.$pictureName, $pictureData);

            $user->setPicture($pictureName);
        }

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            throw new Exception($errors[0]->getMessage());
        }

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/users", name="edit_users_positions", methods={"PATCH"})
     *
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     * @throws Exception
     */
    public function editUsersPositionsAction(Request $request, ValidatorInterface $validator): Response
    {
        if (!$this->allowAccess($request->headers->get('authorization'), ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $em = $this->getDoctrine()->getManager();

        foreach (json_decode($request->getContent()) as $userFromRequest) {
            $user = $em->getRepository(User::class)->find($userFromRequest->id);
            $user->setPosition($userFromRequest->position);

            $errors = $validator->validate($user);

            if (count($errors) > 0) {
                throw new Exception($errors[0]->getMessage());
            }
        }

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/users/verify-token/{token}", name="verify_token", methods={"GET"})
     *
     * @param string $token
     * @return Response
     * @throws Exception
     */
    public function verifyTokenAction(string $token): Response
    {
        $em = $this->getDoctrine()->getManager();

        if ($user = $em->getRepository(User::class)->findOneBy(['token' => $token])) {
            if ($user->getPassword()) {
                throw new Exception('Erreur : cet utilisateur a déjà été activé');
            } else {
                return new Response('', Response::HTTP_OK);
            }
        } else {
            throw new Exception('Erreur : cet utilisateur n\'existe pas');
        }
    }

    /**
     * @Route("/api/users/activate/{token}", name="activate_user", methods={"PATCH"})
     *
     * @param string $token
     * @param Request $request
     * @param Filesystem $filesystem
     * @param ValidatorInterface $validator
     * @return Response
     * @throws Exception
     */
    public function activateUserAction(string $token, Request $request, Filesystem $filesystem, ValidatorInterface $validator): Response
    {
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);

        $requestContent = json_decode($request->getContent());

        $this->get('serializer')->deserialize($request->getContent(), User::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $user]);

        $user->setPassword(hash('sha3-512', $requestContent->password));

        if ($requestContent->pictureFile) {
            $pictureData = base64_decode(explode(',', $requestContent->pictureData)[1]);
            $pictureName = md5($user->getUsername()).$requestContent->pictureExtension;

            $filesystem->dumpFile('img/users/'.$pictureName, $pictureData);

            $user->setPicture($pictureName);
        }

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            throw new Exception($errors[0]->getMessage());
        }

        $em->flush();

        $response = new Response($this->get('serializer')->serialize($user, 'json', ['groups' => ['user', 'connectedUser']]), Response::HTTP_OK);
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/users/login", name="login", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function logInAction(Request $request): Response
    {
        $requestContent = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->findOneBy(
            ['username' => $requestContent->username, 'password' => hash('sha3-512', $requestContent->password)]
        );

        if ($user) {
            $response = new Response($this->get('serializer')->serialize($user, 'json', ['groups' => ['user', 'connectedUser']]), Response::HTTP_OK);
            $response->headers->set('Content-type', 'application/json');

            return $response;
        } else {
            throw new Exception('Erreur : aucun utilisateur correspondant');
        }
    }

    /**
     * @Route("/api/users/password-request", name="password_request", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function passwordRequestAction(Request $request, \Swift_Mailer $mailer): Response {
        $requestContent = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->findOneBy(
            ['username' => $requestContent->username, 'email' => $requestContent->email]
        );

        if ($user) {
            $user->setPasswordToken(hash('md5', uniqid('bh3', true).$user->getUsername()));
            $em->flush();

            $message = (new \Swift_Message('BH3-Esport - Récupération de votre mot de passe'))
                ->setFrom('contact@bh3-esport.fr')
                ->setTo($user->getEmail())
                ->setBody(
                    $this->renderView('emails/reset-password.html.twig', ['user' => $user]),
                    'text/html'
                )
            ;

            $mailer->send($message);
        }

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/users/verify-password-token/{passwordToken}", name="verify_password_token", methods={"GET"})
     *
     * @param string $passwordToken
     * @return Response
     * @throws Exception
     */
    public function verifyPasswordTokenAction(string $passwordToken): Response
    {
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['passwordToken' => $passwordToken]);

        if ($user) {
            $response = new Response($this->get('serializer')->serialize($user, 'json', ['groups' => ['user', 'connectedUser']]), Response::HTTP_OK);
            $response->headers->set('Content-type', 'application/json');

            return $response;
        } else {
            throw new Exception('Erreur : cet utilisateur n\'existe pas');
        }
    }

    /**
     * @Route("/api/users/edit-password/{id}", name="edit_password", methods={"PATCH"})
     *
     * @param string $id
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function editPasswordAction(string $id, Request $request): Response {


        $requestContent = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->find($id);

        if ($user) {
            $user->setPassword(hash('sha3-512', $requestContent->password));
            $user->setPasswordToken(null);
            $em->flush();

            return new Response('', Response::HTTP_OK);
        } else {
            throw new Exception('Erreur : Token invalide');
        }
    }

    /**
     * @Route("/api/users/{id}", name="delete_user", methods={"DELETE"})
     *
     * @param int $id
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function deleteUserAction(int $id, Request $request): Response
    {
        if (!$this->allowAccess($request->headers->get('authorization'), ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $em = $this->getDoctrine()->getManager();

        $userToDelete = $em->getRepository(User::class)->find($id);

        $em->remove($userToDelete);

        if ($userToDelete) {
            foreach ($em->getRepository(User::class)->findAll() as $user) {
                if ($user->getPosition() > $userToDelete->getPosition()) {
                    $user->setPosition($user->getPosition() - 1);
                }
            }

            $em->flush();

            // Todo : delete picture if the deleted user had one
        }

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @param string|null $token
     * @param array $authorizedRoles
     * @return bool
     */
    protected function allowAccess(?string $token, array $authorizedRoles): bool
    {
        $userFrom = $this->getDoctrine()->getManager()->getRepository(User::class)->findOneBy(['token' => $token]);

        if (!$userFrom) {
            return false;
        }

        foreach ($authorizedRoles as $authorizedRole) {
            foreach ($userFrom->getRoles() as $userRole) {
                if ($authorizedRole === $userRole->getName()) {
                    return true;
                }
            }
        }

        return false;
    }
}
