<?php

namespace App\Controller;

use App\Entity\Roster;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class RosterController extends AbstractController
{
    /**
     * @Route("/api/rosters", name="get_rosters", methods={"GET"})
     *
     * @return Response
     */
    public function getRostersAction(): Response
    {
        $em = $this->getDoctrine()->getManager();

        $rosters = $em->getRepository(Roster::class)->findAll();

        $response = new Response($this->get('serializer')->serialize($rosters, 'json', ['groups' => ['roster']]));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/rosters", name="add_roster", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function addRosterAction(Request $request): Response
    {
        $roster = $this->get('serializer')->deserialize($request->getContent(), Roster::class, 'json');

        $em = $this->getDoctrine()->getManager();

        $em->persist($roster);
        $em->flush();

        return new Response('', Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/rosters/{id}", name="edit_roster", methods={"PATCH"})
     *
     * @param int $id
     * @param Request $request
     * @return Response
     */
    public function editRosterAction(int $id, Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();

        $roster = $em->getRepository(Roster::class)->find($id);
        $this->get('serializer')->deserialize($request->getContent(), Roster::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $roster]);

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/rosters", name="edit_rosters_positions", methods={"PATCH"})
     *
     * @param Request $request
     * @return Response
     */
    public function editRostersPositionsAction(Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();

        foreach (json_decode($request->getContent()) as $rosterFromRequest) {
            $roster = $em->getRepository(Roster::class)->find($rosterFromRequest->id);
            $roster->setPosition($rosterFromRequest->position);
        }

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/rosters/{id}", name="delete_roster", methods={"DELETE"})
     *
     * @param int $id
     * @return Response
     */
    public function deleteRosterAction(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();

        $rosterToDelete = $em->getRepository(Roster::class)->find($id);

        $em->remove($rosterToDelete);

        if ($rosterToDelete) {
            foreach ($em->getRepository(Roster::class)->findAll() as $roster) {
                if ($roster->getPosition() > $rosterToDelete->getPosition()) {
                    $roster->setPosition($roster->getPosition() - 1);
                }
            }

            $em->flush();
        }

        return new Response('', Response::HTTP_OK);
    }
}
