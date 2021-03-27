<?php

namespace App\Controller;

use App\Entity\Partner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class PartnerController extends AbstractController
{
    /**
     * @Route("/api/partners", name="get_partners", methods={"GET"})
     *
     * @return Response
     */
    public function getPartnersAction(): Response
    {
        $em = $this->getDoctrine()->getManager();

        $partners = $em->getRepository(Partner::class)->findAll();

        $response = new Response($this->get('serializer')->serialize($partners, 'json'));
        $response->headers->set('Content-type', 'application/json');

        return $response;
    }

    /**
     * @Route("/api/partners", name="add_partner", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     */
    public function addPartnerAction(Request $request): Response
    {
        $partner = $this->get('serializer')->deserialize($request->getContent(), Partner::class, 'json');

        $em = $this->getDoctrine()->getManager();

        $em->persist($partner);
        $em->flush();

        return new Response('', Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/partners/{id}", name="edit_partner", methods={"PATCH"})
     *
     * @param int $id
     * @param Request $request
     * @return Response
     */
    public function editPartnerAction(int $id, Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();

        $partner = $em->getRepository(Partner::class)->find($id);
        $this->get('serializer')->deserialize($request->getContent(), Partner::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $partner]);

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/partners", name="edit_partners_positions", methods={"PATCH"})
     *
     * @param Request $request
     * @return Response
     */
    public function editPartnersPositionsAction(Request $request): Response
    {
        $em = $this->getDoctrine()->getManager();

        foreach (json_decode($request->getContent()) as $partnerFromRequest) {
            $partner = $em->getRepository(Partner::class)->find($partnerFromRequest->id);
            $partner->setPosition($partnerFromRequest->position);
        }

        $em->flush();

        return new Response('', Response::HTTP_OK);
    }

    /**
     * @Route("/api/partners/{id}", name="delete_partner", methods={"DELETE"})
     *
     * @param int $id
     * @return Response
     */
    public function deletePartnerAction(int $id): Response
    {
        $em = $this->getDoctrine()->getManager();

        $partnerToDelete = $em->getRepository(Partner::class)->find($id);

        $em->remove($partnerToDelete);

        if ($partnerToDelete) {
            foreach ($em->getRepository(Partner::class)->findAll() as $partner) {
                if ($partner->getPosition() > $partnerToDelete->getPosition()) {
                    $partner->setPosition($partner->getPosition() - 1);
                }
            }

            $em->flush();
        }

        return new Response('', Response::HTTP_OK);
    }
}
