<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class AngularController extends AbstractController
{
    /**
     * @return Response
     */
    public function index(): Response
    {
        // Todo : check if the request was sent by a bot

        return $this->render('angular/index.html');
    }
}
