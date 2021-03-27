<?php

namespace App\Controller;

use App\Entity\Palmares;
use App\Entity\User;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class PalmaresController extends AbstractController
{
    /**
     * @Route("/api/palmares", name="get_palmares", methods={"GET"})
     * 
     * @return Response
     */
    public function getAllPalmaresAction(): Response
    {
        $em = $this->getDoctrine()->getManager();

        $palmares = $em->getRepository(Palmares::class)->findAll();

        $response = new Response($this->get('serializer')->serialize($palmares, 'json'));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/palmares", name="add_palmares", methods={"POST"})
     * 
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     * @throws Exception
     */
    public function addPalmaresAction(Request $request, ValidatorInterface $validator): Response
    {
        if (!$this->allowAccess(
            $request
            ->headers
            ->get('authorization'), ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $palmares = $this->get('serializer')
        ->deserialize($request->getContent(), Palmares::class, 'json');

        $em = $this->getDoctrine()->getManager();

        $errors = $validator->validate($palmares);

        if (count($errors) > 0) {
            throw new Exception($errors[0]->getMessage());
        }

        $em->persist($palmares);
        $em->flush();

        $response = new Response($this->get('serializer')
        ->serialize($palmares, 'json'), Response::HTTP_CREATED);
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/palmares/{id}", name="edit_palmares", methods={"PATCH"})
     * 
     * @param int $id
     * @param Request $request
     * @return Response
     * @param ValidatorInterface $validator
     * @throws Exception
     */
    public function editPalmaresAction(int $id, Request $request, ValidatorInterface $validator): Response
    {
        if (!$this->allowAccess($request->headers->get('authorization'), 
            ['Président', 'Vice-Président', 'Head Manager', 'Secrétaire'])) {
            throw new Exception('Vous n\'avez pas la permission d\'effectuer cette action');
        }

        $em = $this->getDoctrine()->getManager();

        $palmares = $em->getRepository(Palmares::class)->find($id);
        $this->get('serializer')->deserialize($request->getContent(), Palmares::class, 'json', 
        [AbstractNormalizer::OBJECT_TO_POPULATE => $palmares]);

        $errors = $validator->validate($palmares);

        if (count($errors) > 0) {
            throw new Exception($errors[0]->getMessage());
        }

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/palmares/{id}", name="delete_palmares", methods={"DELETE"})
     *
     * @param int $id
     * @return Response
     */
    public function deletePalmaresAction(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($em->getRepository(Palmares::class)->find($id));

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @param string|null $token
     * @param array $authorizedRoles
     * @return bool
     */
    protected function allowAccess(?string $token, array $authorizedRoles): bool
    {
        $userFrom = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository(User::class)
            ->findOneBy(['token' => $token]);

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