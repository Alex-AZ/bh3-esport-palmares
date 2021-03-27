<?php

namespace App\Controller;

use App\Entity\Role;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class RoleController extends AbstractController
{
    /**
     * @Route("/api/roles", name="get_roles", methods={"GET"})
     *
     * @return Response
     */
    public function getRolesAction(): Response
    {
        $em = $this->getDoctrine()->getManager();

        $roles = $em->getRepository(Role::class)->findAll();

        $response = new Response($this->get('serializer')->serialize($roles, 'json', ['groups' => ['role']]));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/roles", name="add_role", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function addRoleAction(Request $request): Response
    {
        $role = $this->get('serializer')->deserialize($request->getContent(), Role::class, 'json');

        $em = $this->getDoctrine()->getManager();

        $em->persist($role);
        $em->flush();

        return new Response('', Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/roles/{id}", name="edit_role", methods={"PATCH"})
     *
     * @param int $id
     * @param Request $request
     * @return Response
     */
    public function editRoleAction(int $id, Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();

        $role = $em->getRepository(Role::class)->find($id);
        $this->get('serializer')->deserialize($request->getContent(), Role::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $role]);

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/roles/{id}", name="delete_role", methods={"DELETE"})
     *
     * @param int $id
     * @return Response
     */
    public function deleteRoleAction(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($em->getRepository(Role::class)->find($id));
        $em->flush();

        return new Response('', Response::HTTP_OK);
    }
}
